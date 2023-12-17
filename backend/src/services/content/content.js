
import { auth } from '../middlewares';
import { contentFindByOrgId, createContent, deleteContent, getContent, updateContent } from './content.entity';

export default function content() {

  /**
    * POST /content
    * @description This route is used to create a content.
    * @response {Object} 200 - the new content.
    */
  this.route.post('/content', auth, createContent(this));


  /**
    * GET /content
    * @description This route is used to get all content.
    * @response {Array} 200 - the all content.
    */
  this.route.get('/content', auth, getContent(this));

  /**
    * GET /content
    * @description This route is used to find content by organization id.
    * @response {Array} 200 - the content by org id.
    */
  this.route.get('/content/:orgId', auth, contentFindByOrgId(this));


  /**
    * delete /content
    * @description This route is used to delete a content.
    * @response {Object} 200 - this content.
  */
  this.route.delete('/content/:id', auth, deleteContent(this));


  /**
    * put /content
    * @description This route is used to update a content.
    * @response {Object} 200 - this content.
  */
  this.route.put('/content/:id', auth, updateContent(this));

}