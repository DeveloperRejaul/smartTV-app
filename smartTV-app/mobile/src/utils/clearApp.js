import { asyncKeys } from '../constants/constants';
import { deleteAllFile } from './FileOperation';
import { removeAsyncData } from './asycSrotegeOpration';

const ClearApp = () => ({
  deleteMemoryAllData: async () => await deleteAllFile(),
  clearAsyncAllData: async () => {
    const keys = Object.values(asyncKeys);
    Promise.allSettled(keys.map((key) => removeAsyncData(key)));
  },
});

export const clearApp = ClearApp();
