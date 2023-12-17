import User from './user.schema';
import Content from '../content/content.schema';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { sendOtpTemplate } from '../../controllers/email/template';
import { decryptToken, encryptToken } from '../../utils/utils.fn';
// import decodeAuthToken from '../../utils/decodeAuthToken';
const allowedQuery = new Set(['page', 'limit', 'sortBy', 'search', 'name', 'paginate', 'userType']);

/**
 * This function is used for create a user.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
const requiredInput = ['email', 'password'];
export const createUser = ({ db, fileUp, lyra }) => async (req, res) => {
  try {
    if (req.body?.data) req.body = JSON.parse(req.body?.data || '{}');
    // require input check
    const valid = requiredInput.every((d) => Object.keys(req.body).includes(d));
    if (!valid) return res.status(404).send('bed request');

    // input type check
    const validType = Object.values(req.body).every((d) => typeof d === 'string');
    if (!validType) return res.status(404).send('input type invalid');

    // add image data in body
    if (req.files?.image)
      req.body.avatar = await fileUp(req.files?.image.path);

    req.body.password = await bcrypt.hash(req.body.password, 8);
    const user = await db.create({ table: User, key: { ...req.body, populate: { path: 'org' } } });
    if (!user) return res.status(400).send('Bad Request');
    res.status(200).send(user);
    await lyra.insert('user', { id: user.id, name: user.name, email: user.email });

  } catch (error) {
    res.status(500).send({ message: 'Something went wrong', error });
    console.log(error);
  }
};

/**
 * This function is used for get user.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const getUsers = ({ db }) => async (req, res) => {
  try {
    if (req.query.paginate) {
      const user = await db.find({ table: User, key: { paginate: JSON.parse(req.query.paginate) } });
      const supperAdmins = await user?.filter(d => d.userType === 'supper-admin')?.length;
      const owners = await user?.filter(d => d.userType === 'masjid-owner')?.length;
      const admins = await user?.filter(d => d.userType === 'admin')?.length;
      const users = await user?.filter(d => d.userType === 'user')?.length;
      return res.status(200).send({ supperAdmins, owners, admins, users });
    }
    const user = await db.find({ table: User, key: { populate: { path: 'org' }, paginate: true, allowedQuery, query: req.query } });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for login user.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */

export const loginUser = ({ db, settings }) => async (req, res) => {

  const device = req.params?.device;
  const email = req.body?.email;
  const password = req.body?.password;
  try {
    const user = await db.findOne({ table: User, key: { email, populate: { path: 'org' } } });
    if (user) {
      const token = jwt.sign({ id: user._id, email, password }, settings.cookieKey);
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        if (device === 'android' && user.userType === 'user') {
          const content = await db.find({ table: Content, key: { paginate: false, org: { $in: user?.org?.id } } });
          return res.status(200).send({ user, token, content });
        }
        if (device === 'web' && user.userType !== 'user') {
          res.cookie(settings.cookieKey, token, {
            httpOnly: true,
            ...settings.useHTTP2 && {
              sameSite: 'None',
              secure: true,
            },
            ...!req.body.rememberMe && { expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 365)) },
          });
          return res.status(200).send(user);
        }
        return res.status(201).send('bad request');
      }
    }

    res.status(404).send('Invalid email or password');
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for delete user.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const deleteUser = ({ db, lyra }) => async (req, res) => {
  try {
    const id = req.params?.id;
    const user = await db.findOne({ table: User, key: { _id: id } });
    if (!user) return res.status(404).send('bad request');
    if (fs.existsSync(user.avatar)) fs.unlink(user.avatar, () => { });
    const result = await db.remove({ table: User, key: { _id: id } });
    res.status(200).send(result);

    // handle lyra data 
    await lyra.remove('user', result._id);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for find user with mail.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const findEmailExist = ({ db, mail }) => async (req, res) => {
  try {
    const email = req.body?.email;
    const result = await db.findOne({ table: User, key: { email } });
    if (!result) return res?.status(400).send('Invalid email address');
    const otp = Math.floor(Math.random() * 9000) + 1000;
    const token = encryptToken({ email: req.body.email, otp, time: new Date() });
    const mailRes = await mail({
      receiver: req.body.email,
      subject: 'TAQWIM TV - Password Reset OTP',
      body: sendOtpTemplate(otp),
      type: 'html',
    });
    if (!mailRes) return res?.status(400).send('Forbidden');
    res.status(200).send({ email: req.body.email, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for verify otp.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */

export const verifyOtp = () => async (req, res) => {
  try {
    const { otp, token } = req.body;
    if (!otp || !token) return res.status(400).send({ status: 400, message: 'Bad request' });
    const decoded = decryptToken(token);
    if (!decoded) return res.status(400).send({ status: 400, message: 'Bad request' });
    if (otp !== decoded.otp) return res.status(400).send({ status: 400, message: 'Invalid Otp' });
    const time = new Date(decoded.time);
    if (Math.abs(time - new Date()) > 300000) return res.status(400).send({ status: 400, message: 'Otp has been expired' });
    const newToken = encryptToken({ email: decoded.email, otp, time: new Date() });
    return res.status(200).send({ status: 200, data: { token: newToken } });


  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');

  }
};


/**
 * This function is used for set new password.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const resetPassword = ({ db }) => async (req, res) => {
  try {
    const { otp, token, password } = req.body;
    if (!otp || !token) res.status(400).send('Bad Request');

    const decoded = decryptToken(token);
    if (!decoded.email || !decoded.otp || !decoded.time) return res.status(400).send('Bad Request');

    // check 5 minutes
    if (otp !== decoded.otp || Math.abs(new Date() - new Date()) > 300000) return res.status(400).send('Bad Request');
    if (password.length < 6) return res.status(400).send('Invalid password length');
    const newPassword = await bcrypt.hash(password, 8);
    const result = await db.update({ table: User, key: { email: decoded.email, body: { password: newPassword } } });
    if (!result) res.status(400).send('Bad request');
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for find user with user type.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const findUserWithType = ({ db, lyra }) => async (req, res) => {
  try {
    const type = req.params?.type;

    if (req.query.search) {
      const lyraResult = await lyra.search('user', { term: req.query.search, properties: ['name', 'email'] });
      if (lyraResult.hits.length > 0) {
        const ids = lyraResult.hits.map(d => d.id);
        const userWithLyra = await db.find({ table: User, key: { $and: [{ userType: { $in: type } }, { _id: { $in: ids } }], allowedQuery, query: req.query, populate: { path: 'org' } } });
        return res.status(200).send(userWithLyra);
      }
      return res.status(200).send({ docs: [] });
    }
    const result = await db.find({ table: User, key: { userType: { $in: type }, allowedQuery, query: req.query, populate: { path: 'org' } }, });
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for update user with user  id.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const updateUser = ({ db, fileUp, lyra }) => async (req, res) => {
  try {
    const id = req.params?.id;
    if (req.body?.data) req.body = JSON.parse(req.body?.data || '{}');

    // check data type
    const validType = Object.values(req.body).every((d) => typeof d === 'string');
    if (!validType) return res.status(404).send('invalid data type');
    if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, 8);

    if (req.files?.image) req.body.avatar = await fileUp(req.files.image?.path);
    const result = await db.update({ table: User, key: { _id: id, body: { ...req.body }, populate: { path: 'org' } } });
    await res.status(200).send(result);

    // user update handle lyra data 
    await lyra.remove('user', result._id);
    await lyra.insert('user', { id: result.id, name: result.name, email: result.email });

  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

/**
 * This function is used for logout  user.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const logoutUser = ({ settings }) => async (req, res) => {
  try {
    res.clearCookie(settings.cookieKey, {
      httpOnly: true,
      ...settings.useHTTP2 && {
        sameSite: 'None',
        secure: true,
      },
      expires: new Date(Date.now())
    });
    return res.status(200).send('Logout successful');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }

};


/**
 * This function is used  for check user token valid.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const checkUserValid = () => async (req, res) => {
  try {
    // const token = req.headers?.cookie?.split('=')[1];
    // if (token) {
    //   console.log('cook', token);
    //   const data = await decodeAuthToken(token);
    //   return res.status(200).send(data);
    // }
    // return res.status(404).json({ message: 'user unauthorized' });
    return res.status(200).send(req.user);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }
};


/**
 * This function is used  for check old password valid.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const updatePasswordByOldPass = ({ db }) => async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body || {};
    const user = await db.findOne({ table: User, key: { _id: id } });
    const result = await bcrypt.compare(oldPassword, user.password);
    if (!result) return res.status(400).send('bad request');
    if (result) {
      const password = await bcrypt.hash(newPassword, 8);
      const result = await db.update({ table: User, key: { id, body: { password } } });
      res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }
};



/**
 * This function is find user by org id.
 * @param {Object} req This is the request object.
 * @param {Object} res this is the response object
 * @returns It returns the data for success response. Otherwise it will through an error.
 */
export const findUserWithOrgId = ({ db }) => async (req, res) => {
  try {
    const orgId = req?.params?.org;
    const result = await db.find({
      table: User,
      key: { org: { $in: orgId }, query: req.query, allowedQuery, paginate: req.query.paginate === 'true', populate: { path: 'org' } },
    });
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong');
  }
};

export const getUserCount = async (usersArr = []) => {
  try {
    const users = usersArr?.filter(f => f.type === 'user');
    const orgCount = users.reduce((countObj, obj) => {
      countObj[obj.org] = (countObj[obj.org] || 0) + 1;
      return countObj;
    }, {});
    return orgCount;

  } catch (error) {
    //

  }

};

export const joinRoom = async ({ data, session }) => {
  try {

    session['join'](data);
    console.log('A user connected to room => ', data);
  } catch (error) {
    console.log(error);
  }
};

export const leaveRoom = async ({ data, session }) => {
  try {

    session['leave'](data);
    console.log('A user leave room => ', data);
  } catch (error) {
    console.log(error);
  }
};