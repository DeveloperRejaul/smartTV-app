import content from './content/content';
import file from './file/file';
import organization from './organization/organization';
import user, { userSocket } from './user/user';

export const services = (app) => {
  app.configure(file);
  app.configure(user);
  app.configure(organization);
  app.configure(content);
  userSocket(app);

};
