import fs from 'fs';
import Organization from './organization.schema';
import Content from '../content/content.schema';
import User from '../user/user.schema';

import { socketAction } from '../../utils/socketAction';
const allowedQuery = new Set(['page', 'limit', 'sortBy', 'search', 'name']);

/**
 * This function is used for create Organization.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
const requiredInput = ['name', 'timezone', 'timeFormat'];
export const createOrganization = ({ db, fileUp, lyra }) => async (req, res) => {
  try {
    if (req.body?.data) req.body = JSON.parse(req.body?.data || '{}');

    // checking required input  
    const valid = requiredInput.every((d) => Object.keys(req.body).includes(d));
    if (!valid) return res.status(404).send('bed request');

    // checking valid type input input  
    // const validType = Object.values(req.body).every((d)=> typeof d === 'string');
    // if (!validType) return res.status(404).send('bad input type');

    // add image data in body
    if (req.files?.image) req.body.avatar = await fileUp(req.files?.image.path);
    console.log(req.body);
    const organization = await db.create({ table: Organization, key: req.body });

    // create prayer time 
    const result = await fetch(`https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=year&zone=${req?.body?.timezone}`);
    const data = await result.json();
    const contentData = { type: 'prayerTime', data: data.prayerTime, org: organization.id.toString(), zone: req?.body?.timezone };
    await db.create({ table: Content, key: contentData });
    await res.status(200).send(organization);

    // handle lyra data
    await lyra.insert('organization', { id: organization?.id, name: organization?.name, location: organization?.location });

  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for find Organization.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const getOrganization = ({ db, lyra }) => async (req, res) => {
  try {
    // handle lyra search
    if (req.query.search) {
      const lyraResult = await lyra.search('organization', { term: req.query.search, properties: '*' });
      if (lyraResult.hits.length > 0) {
        const ids = lyraResult.hits.map(d => d.id);
        const organizationWithLyra = await db.find({ table: Organization, key: { _id: { $in: ids }, allowedQuery, query: req.query } });
        return res.status(200).send(organizationWithLyra);
      }
      return res.status(200).send({ docs: [] });
    }

    const organization = await db.find({ table: Organization, key: { allowedQuery, query: req.query } });
    res.status(200).send(organization);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for delete Organization.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const deleteOrganization = ({ db, ws, lyra }) => async (req, res) => {
  try {
    const id = req.params?.id;
    const organization = await db.findOne({ table: Organization, key: { _id: id } });
    if (fs.existsSync(organization.avatar)) fs.unlink(organization.avatar, () => { });
    const result = await db.remove({ table: Organization, key: { _id: id } });

    // remove all org related content
    const contents = await db.find({ table: Content, key: { org: { $in: id } } });
    const hasSrcData = contents.docs.filter(d => d.src);
    for (const obj of hasSrcData) if (fs.existsSync(obj.src)) fs.unlink(obj.src, () => { });
    await db.removeAll({ table: Content, key: { org: { $in: id } } });

    // remove all org related user
    const user = await db.find({ table: User, key: { org: { $in: id } } });
    const hasUserAvatarsObj = user.docs.filter(d => d.avatar);
    for (const avatarObj of hasUserAvatarsObj) {
      if (fs.existsSync(avatarObj.avatar)) fs.unlink(avatarObj.avatar, () => { });
    }
    await db.removeAll({ table: User, key: { org: { $in: id } } });
    await res.status(200).send(result);

    // handle lyra data 
    await lyra.remove('organization', result._id);

    // handle web socket 
    ws.to(String(req.user._id)).emit(socketAction.DELETE_ORG, result);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for update Organization.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const updateOrganization = ({ db, fileUp, ws, lyra }) => async (req, res) => {
  try {
    const id = req.params?.id;
    const org = await db.findOne({ table: Organization, key: { _id: id } });
    if (req.body?.data) req.body = JSON.parse(req.body?.data || '{}');

    if (req.files?.image) {
      if (fs.existsSync(org?.avatar)) fs.unlink(org.avatar, () => { });
      req.body.avatar = await fileUp(req.files?.image.path);
    }
    const result = await db.update({ table: Organization, key: { _id: id, body: req.body } });
    await res.status(200).send(result);

    // handle lyra data
    await lyra.remove('organization', result._id);
    await lyra.insert('organization', { id: result?.id, name: result?.name, location: result?.location });

    // handle socket action 
    const user = await db.find({ table: User, key: { org: { $in: result.id } } });
    await Promise.all(user?.docs?.map(d => ws.to(d.id).emit(socketAction.UPDATE_ORG, result)));

    ws.to(req.body.userId).emit(socketAction.UPDATE_ORG, result);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};


/**
 * This function is used for find Organization with id.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const findOrgById = ({ db }) => async (req, res) => {
  try {
    const id = req?.params?.id;
    const organization = await db.findOne({ table: Organization, key: { _id: id } });
    res.status(200).send(organization);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};
/**
 * This function is used for find Organization by name.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const findOrgByName = ({ db }) => async (req, res) => {
  try {
    const name = req?.params?.name;
    const organization = await db.find({ table: Organization, key: { name } });
    res.status(200).send(organization);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for find Organization by name.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const patchOrg = ({ db }) => async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).send('Bad Request');
    const org = await db.findOne({ table: Organization, key: { id: req.params.id } });
    if (!org) return res.status(401).send('Invalid Organization Id');
    org.screen[Object.keys(req.body)[0]] = req.body[Object.keys(req.body)[0]];
    await db.save(org);
    return res.status(200).send(org);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};