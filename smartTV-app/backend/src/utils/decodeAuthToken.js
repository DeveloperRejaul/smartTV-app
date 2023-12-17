import jwt from 'jsonwebtoken';
import User from '../services/user/user.schema';
import settings from '../settings';

/**
 * This function is used for decoding auth token.
 * @param {String} token The token to decode.
 * @returns returns the decoded user found in database.
 */
export default async function decodeAuthToken(token) {
  try {
    const decoded = await new Promise(resolve => {
      jwt.verify(token, settings.cookieKey, function (err, decoded) {
        if (err) throw new Error(err);
        else resolve(decoded);
      });
    });

    return await User.findById({ _id: decoded.id });
  }
  catch (e) {
    console.log(e);
    return null;
  }
}