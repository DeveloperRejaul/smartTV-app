const eventsToHandle = ['SIGTERM', 'SIGINT', 'unhandledRejection', 'uncaughtException', 'SIGUSR2'];
import fs from 'fs';
import path from 'path';

const cachePath = path.join(path.resolve(), 'cache');
if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath,{recursive:true});

export default function gracefullShutdown() {
  //events to handle
  eventsToHandle.forEach(async e => process.on(e, async orgErr => {
    try {
      console.log(orgErr);
      await this.search.save().catch(e => console.log(e));
      return process.exit();
    }
    catch (e) {
      console.log(e);
      return process.exit();
    }
  }));
}