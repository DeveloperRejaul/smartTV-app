import { auth } from '../middlewares';
import {
  checkUserValid,
  updateUser,
  createUser,
  deleteUser,
  findEmailExist,
  findUserWithOrgId,
  findUserWithType,
  getUsers,
  loginUser,
  logoutUser,
  resetPassword,
  updatePasswordByOldPass,
  verifyOtp,
  joinRoom,
  leaveRoom,
} from './user.entity';

export default function user() {
  /**
   * POST /user
   * @description This route is used to create a user.
   * @response {Object} 200 - the new user.
   */
  this.route.post('/user', auth, createUser(this));
  /**
   * POST /user
   * @description This route is used to create a user.
   * @response {Object} 200 - the new user.
   */
  this.route.post('/user/super-admin', createUser(this));

  /**
   * GET /user
   * @description This route is used to get all users.
   * @response {Object} 200 - the all users.
   */
  this.route.get('/user', auth, getUsers(this));

  /**
   * POST /user/find
   * @description This route is used to find user by email.
   * @response {Object} 200 - the delete user res.
   */
  this.route.post('/user/find', findEmailExist(this));

  /**
   * POST /user/verify-otp
   * @description This route is used to verify otp.
   * @response {Object} 200 - the delete user res.
   */
  this.route.post('/user/verify-otp', verifyOtp(this));

  /**
   * POST /user/setpassword
   * @description This route is used to find user by email.
   * @response {Object} 200 - the reset password user res.
   */
  this.route.post('/user/setpassword', resetPassword(this));

  /**
   * POST /user/logout
   * @description This route is used to logout user.
   * @response {Object} 200 - the logout user.
   */
  this.route.post('/user/logout', logoutUser(this));

  /**
   * POST /user/check
   * @description This route is used to check user.
   * @response {Object} 200 - the check user.
   */
  this.route.post('/user/check', auth, checkUserValid(this));

  /**
   * POST /user/password
   * @description This route is used to check user.
   * @response {Object} 200 - the check user.
   */
  this.route.post('/user/password', updatePasswordByOldPass(this));

  /**
   * POST /user/login
   * @description This route is used to login users.
   * @response {Object} 200 - the all users.
   */
  this.route.post('/user/login/:device', loginUser(this));

  /**
   * GET /user/organization/:org
   * @description This route is used to find user with org id.
   * @response {Object} 200 - the find user with org id.
   */
  this.route.get('/user/organization/:org', auth, findUserWithOrgId(this));

  /**
   * GET /user/:type
   * @description This route is used to find user by email.
   * @response {Object} 200 - the delete user res.
   */
  this.route.get('/user/:type', auth, findUserWithType(this));

  /**
   * DELETE /user/:id
   * @description This route is used to delete user.
   * @response {Object} 200 - the delete user res.
   */
  this.route.delete('/user/:id', auth, deleteUser(this));

  /**
   * PUT /user/:id
   * @description This route is used to user by id.
   * @response {Object} 200 - the updated user res.
   */
  this.route.put('/user/:id', auth, updateUser(this));
}

export const userSocket = (app) => {
  app.register('joinRoom', joinRoom);
  app.register('leaveRoom', leaveRoom);
};
