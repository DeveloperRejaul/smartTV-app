import { getFile } from './file.entity';

export default function file() {
  this.route.get('/upload/:path', getFile());
}
