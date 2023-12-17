import { auth } from '../middlewares';
import { createOrganization, deleteOrganization, findOrgById, findOrgByName, getOrganization, patchOrg, updateOrganization } from './organization.entity';

export default function organization() {
  /**
    * POST /organization
    * @description This route is used to create a organization.
    * @response {Object} 200 - the new organization.
    */
  this.route.post('/organization', auth, createOrganization(this));

  /**
    * GET /organization
    * @description This route is used to get organization.
    * @response {Object} 200 - the all organization.
    */
  this.route.get('/organization', auth, getOrganization(this));


  /**
    * DELETE /organization
    * @description This route is used to delete organization.
    * @response {Object} 200 - the delete organization.
    */
  this.route.delete('/organization/:id', auth, auth, deleteOrganization(this));


  /**
    * PUT /organization
    * @description This route is used to update organization.
    * @response {Object} 200 - the update organization.
    */
  this.route.put('/organization/:id', auth, updateOrganization(this));

  /**
    * patch /organization
    * @description This route is used to update organization.
    * @response {Object} 200 - the update organization.
    */
  this.route.patch('/organization/:id', auth, patchOrg(this));


  /**
    * GET /organization/:id
    * @description This route is used to update organization.
    * @response {Object} 200 - the update organization.
    */
  this.route.get('/organization/:id', auth, findOrgById(this));


  /**
    * GET /organization/:name
    * @description This route is used to update organization.
    * @response {Object} 200 - the update organization.
    */
  this.route.get('/organization/:name', auth, findOrgByName(this));
}