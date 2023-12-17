import { socketAction } from '../../utils/socketAction';
import Content from './content.schema';
import User from '../user/user.schema';
import Organization from '../organization/organization.schema';
import fs from 'fs';
import { categorizeUrls } from '../../utils/utils.fn';
const allowedQuery = new Set(['page', 'limit', 'sortBy', 'search', 'type', 'org']);

/**
 * This function is used for create content.
 * @param {Object} req This is the request object.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
const requiredInput = ['type', 'org'];
export const createContent = ({ db, fileUp, ws, lyra }) => async (req, res) => {
  try {

    if (req.body?.data) req.body = JSON.parse(req.body?.data || '{}');
    // checking required input
    const valid = requiredInput.every((d) =>
      Object.keys(req.body).includes(d)
    );
    if (!valid) return res.status(200).send('bed request');
    const { days, dateRange } = req.body;
    delete req.body.days;
    delete req.body.dateRange;

    // checking input type
    // const validType = Object.values(req.body).every((d) => typeof d === 'string');
    // if (!validType) return res.status(200).send('invalid input type');

    const arrayValid = Object.values({ days, dateRange }).every(d => Array.isArray(d) === true);
    if (days && dateRange && !arrayValid) return res.status(200).send('invalid input type ');
    const rest = days && dateRange ? { days, dateRange } : {};


    if (req.files?.image) {
      if (req.body.slidePhotos) {
        if (!Array.isArray(req.files?.image)) {
          req.body.slidePhotos = [...req.body.slidePhotos, (await fileUp(req.files.image.path))];

        }
        else {
          for (let img of req.files.image) {
            req.body.slidePhotos = [...req.body.slidePhotos, (await fileUp(img.path))];
          }
        }

      }
      else {
        req.body.src = await fileUp(req.files.image.path);
        req.body.fileName = (req.files.image.originalFilename);

      }

    }
    if (req.files?.audio) {
      req.body.audioSrc = await fileUp(req.files.audio.path);
      req.body.audioFileName = (req.files.audio.originalFilename);

    }

    // check prayer type content duplicate
    const allContent = await db.find({
      table: Content,
      key: { org: { $in: req?.body?.org }, paginate: false },
    });
    if (req.body.type === 'prayerTime') {
      const contentType = (allContent || []).some((d) => d?.type === req?.body?.type);
      if (contentType) return res.status(404).send('Already this content available');
      const { zone } = req.body || {};
      const result = await fetch(
        `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=year&zone=${zone}`
      );
      const data = await result.json();
      req.body.data = data.prayerTime;
    }

    // checking duplicate content type
    if (req?.body?.type !== 'slide' && req?.body?.type !== 'prepareSalatSlide') {
      const similarTypeContent = (allContent || []).some((d) => d?.type === req?.body?.type && d?.waqto === req?.body?.waqto);
      if (similarTypeContent) return res.status(404).send('Already this content available');
    }
    const content = await db.create({ table: Content, key: { ...req.body, ...rest, populate: { path: 'org', select: 'name location' } } });
    if (!content) return res.status(400).send('Bad Request');
    res.status(200).send(content);
    // handle lyra data
    await lyra.insert('content', { id: content?.id, waqto: content?.waqto, type: content?.type });

    // sending socket event in tv
    const users = await db.find({ table: User, key: { org: { $in: req.body?.org } } });
    const tvUser = users?.docs?.filter((d) => d.userType === 'user');

    Promise.all(tvUser.map(user => ws.to(String(user?._id)).emit(socketAction.CONTENT, {
      data: content,
      type: 'POST',
    })));
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for get all content.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const getContent = ({ db, lyra }) => async (req, res) => {
  try {
    // handle lyra search
    if (req.query.search) {
      const lyraResult = await lyra.search('content', {
        term: req.query.search,
        properties: '*',
      });
      if (lyraResult.hits.length > 0) {
        const ids = lyraResult.hits.map((d) => d.id);
        const contentWithLyra = await db.find({
          table: Content,
          key: {
            _id: { $in: ids },
            populate: { path: 'org', select: 'name id location' },
            allowedQuery,
            query: req.query,
          },
        });
        return res.status(200).send(contentWithLyra);
      }
      return res.status(200).send({ docs: [] });
    }

    const content = await db.find({
      table: Content,
      key: {
        populate: { path: 'org', select: 'name id location' },
        allowedQuery,
        query: req.query,
      },
    });
    const result = await db.find({
      table: Content,
      key: { paginate: false },
    });

    const { videos, images, urls, audio } = (await categorizeUrls(result)) || {};
    res.status(200).send({ ...content, totalImage: videos, totalVideo: images, totalUrl: urls, totalAudio: audio, });
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for get all content.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const deleteContent = ({ db, ws, lyra }) => async (req, res) => {
  try {
    const id = req.params?.id;
    const content = await db.findOne({ table: Content, key: { _id: id } });
    if (content?.src)
      if (fs.existsSync(content.src)) fs.unlink(content.src, () => { });
    const result = await db.remove({ table: Content, key: { _id: id } });
    res.status(200).send(result);

    // handle lyra data
    await lyra.remove('content', result?._id);

    // sending socket event in tv device
    const users = await db.find({
      table: User,
      key: { org: { $in: result?.org } },
    });
    const tvUser = users?.docs?.filter((d) => d.userType === 'user');

    Promise.all(tvUser.map(user => ws.to(String(user?._id)).emit(socketAction.CONTENT, {
      data: content,
      type: 'DELETE',
    })));

  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for find content by organization id.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const contentFindByOrgId = ({ db, lyra }) => async (req, res) => {
  try {
    const id = req.params?.orgId;
    if (req.query.search) {
      const lyraResult = await lyra.search('content', {
        term: req.query.search,
        properties: '*',
      });
      if (lyraResult.hits.length > 0) {
        const ids = lyraResult.hits.map((d) => d.id);
        const contentWithLyra = await db.find({
          table: Content,
          key: {
            _id: { $in: ids },
            org: req.params.orgId,
            populate: { path: 'org', select: 'name id location' },
            allowedQuery,
            query: req.query,
          },
        });
        return res.status(200).send(contentWithLyra);
      }
      return res.status(200).send({ docs: [] });
    }
    const content = await db.find({
      table: Content,
      key: {
        org: { $in: id },
        paginate: req.query.paginate !== 'false',
        populate: { path: 'org', select: 'name id location' },
      },
    });
    res.status(200).send(content);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for update organization by id.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */

export const updateContent = ({ db, fileUp, ws, lyra }) => async (req, res) => {
  try {
    const id = req.params?.id;

    if (req.body?.data) req.body = JSON.parse(req.body?.data || '{}');
    const { days, dateRange, noFile } = req.body;

    if (req.body.noAudio) {
      if (req.body.noAudio) {
        req.body.audioSrc = '';
      }
      delete req.body.noAudio;
    }

    delete req.body.days;
    delete req.body.dateRange;
    // checking input type
    // const validType = Object.values(req.body).every(
    //   (d) => typeof d === 'string'
    // );
    // if (!validType) return res.status(200).send('invalid input type');
    // const arrayValid = Object.values({ days, dateRange }).every(d => Array.isArray(d) === true);
    // if (days && dateRange && !arrayValid) return res.status(200).send('invalid input type ');
    const rest = days && dateRange ? { days, dateRange } : {};
    const content = await db.findOne({ table: Content, key: { _id: id } });
    if (req.body.src) {
      content.fileName = undefined;
    }
    if (req.files?.image) {
      if (req.body.slidePhotos) {
        if (!Array.isArray(req.files?.image)) {
          req.body.slidePhotos = [...req.body.slidePhotos, (await fileUp(req.files.image.path))];

        }
        else {
          for (let img of req.files.image) {
            req.body.slidePhotos = [...req.body.slidePhotos, (await fileUp(img.path))];
          }
        }

      }

      if (content?.src)
        if (fs.existsSync(content.src)) fs.unlink(content.src, () => { });
      req.body.src = await fileUp(req.files.image.path);
      req.body.fileName = (req.files.image.originalFilename);

    }
    if (req.files?.audio) {
      if (content?.audioSrc)
        if (fs.existsSync(content.audioSrc)) fs.unlink(content.audioSrc, () => { });
      req.body.audioSrc = await fileUp(req.files.audio.path);
      req.body.audioFileName = (req.files.audio.originalFilename);

    }



    if (req.body.type === 'prayerTime') {
      const { zone } = req.body || {};
      const result = await fetch(`https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=year&zone=${zone}`);
      const data = await result.json();
      req.body.data = data.prayerTime;
    }

    // const content = await db.update({ table: Content, key: { id: id, body: { ...req.body, ...rest }, populate: { path: 'org', select: 'name location' } }, });
    // await res.status(200).send(content);
    const newObj = { ...req.body, ...rest };


    // const content = await db.findOne({ table: Content, key: { id } });
    Object.keys(newObj).forEach(key => content[key] = newObj[key]);
    if (noFile === true && content.fileName) {
      content.src = '';
      delete content.fileName;
    }
    await db.save(content);
    if (content.type === 'prayerTime') {
      const organization = await db.findOne({ table: Organization, key: { id: content?.org?.toString() } });
      if (organization) {
        organization.timezone = content?.zone;
        await db.save(organization);
      }
    }
    await db.populate(content, { path: 'org', select: 'name location' });
    await res.status(200).send(content);





    // handle lyra data
    await lyra.remove('content', content?.id);
    await lyra.insert('content', { id: content?.id, waqto: content?.waqto, type: content?.type });

    // sending socket event in tv device
    const users = await db.find({
      table: User,
      key: { org: { $in: content?.org } },
    });
    const tvUser = users?.docs?.filter((d) => d.userType === 'user');

    Promise.all(tvUser.map(user => ws.to(String(user?._id)).emit(socketAction.CONTENT, {
      data: content,
      type: 'UPDATE',
    })));

  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};
