import * as FileSystem from 'expo-file-system';
import { BASE_URL } from '@env';

export const filePath = FileSystem.documentDirectory;

/**
 * @description
 * this function using format check
 * if format is exits return true
 * if format is on exits return false
 * @param {string} uri
 * @param {array} fileFormat
 * @returns {boolean}
 */
function checkFileFormat(uri, fileFormat) {
  const extension = uri?.split('.')[1];
  return fileFormat?.includes(`.${extension}`);
}

/**
 * @returns reading all file in my documentDirectory
 */
export const readFileDir = async () => {
  try {
    return await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
  } catch (error) {
    // console.log(`print from read file function: ${error}`);
  }
  // console.log('🚀 ~ file: FileOperation.js:29 ~ readFileDir ~ error:', error);
};

/**
 * @returns delete all file in my documentDirectory
 */
export const deleteAllFile = async () => {
  try {
    const files = await FileSystem.readDirectoryAsync(filePath);
    for (const file of files) {
      await FileSystem.deleteAsync(`${filePath}/${file}`);
    }
  } catch (error) {
    // console.log('🚀 ~ file: FileOperation.js:43 ~ deleteAllFile ~ error:', error);
  }
};

/**
 * @returns delete Single file in my documentDirectory
 */
export const deleteSingleFile = async (uri) => {
  try {
    const newUri = uri.replace('upload/', '');
    const allFiles = await readFileDir();
    if (allFiles.includes(newUri)) {
      await FileSystem.deleteAsync(`${filePath}/${newUri}`);
      // console.log('delete file success');
    }
  } catch (error) {
    // console.log('🚀 ~ file: FileOperation.js:58 ~ deleteSingleFile ~ error:', error);
  }
};

export const deleteFile = async (uri) => {
  try {
    const path = FileSystem.documentDirectory;
    await FileSystem.deleteAsync(`${path + uri}`);
    // console.log('delete file success');
  } catch (error) {
    // console.log('🚀 ~ file: FileOperation.js:70 ~ deleteFile ~ error:', error);
    // console.log(`print from delete file function: ${error}`);
  }
  // console.log('🚀 ~ file: FileOperation.js:73 ~ deleteFile ~ error:', error);
};

/**
 * @description download file
 * @param {string} uri
 * @returns file id
 */
export const downloadFile = async (uri = '') => {
  try {
    const dirInfo = await readFileDir();
    const fileId = uri?.split('/')[1];
    const isfileExist = dirInfo.includes(fileId);
    let fileUrl = '';
    if (!isfileExist && checkFileFormat(fileId, ['.jpg', '.png'])) {
      const downloadable = FileSystem.createDownloadResumable(`${BASE_URL}upload/${fileId}`, `${FileSystem.documentDirectory + fileId}`, {}, () => {});
      const file = await downloadable.downloadAsync();
      const urlArray = file.uri?.split('/');
      fileUrl = urlArray[urlArray.length - 1];
    } else {
      fileUrl = fileId;
    }
    // console.log('Download File');
    return fileUrl;
  } catch (error) {
    // console.log('🚀 ~ file: FileOperation.js:98 ~ downloadFile ~ error:', error);
    // console.log(`print from download file function: ${error}`);
  }
  // console.log('🚀 ~ file: FileOperation.js:101 ~ downloadFile ~ error:', error);
};

/**
 * download multiple image file.
 * @param {Array} uri array of image uri path
 * @returns Array of file uri
 */
export const downloadFiles = async (uri = []) => {
  const files = [];
  try {
    // console.log('file Downloading...');
    for (const fileName of uri) {
      const file = await downloadFile(fileName);
      files.push(file);
    }
    // console.log('file download complete ');
    return files;
  } catch (error) {
    // console.log(' 🚀 File con\'t download ~ file: FileOperation.js:68 ~ downloadFiles ~ error:', error);
  }
};

/**
 * @description this function using for save all prayer data in file systems
 * @param {Array} data of array
*/
export const savePrayerDataToFileMemory = async (data) => {
  try {
    await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}prayer`, JSON.stringify(data), { encoding: true });
  } catch (error) {
    // console.log('this call from file operation ,savePrayerDataToFileMemory function ', error);
  }
};

/**
 * @description this function using for read all prayer data in file systems
 * @param {Array}   array of object
*/
export const readPrayerDataToFileMemory = async () => {
  try {
    const dirs = await readFileDir();
    if (dirs.includes('prayer')) {
      return await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}prayer/`);
    }
    return JSON.stringify({});
  } catch (error) {
    // console.log('this call from file operation readPrayerDataToFileMemory function', error);
  }
};

/**
 * @description this function using for save all prayer data in file systems
 * @param {Array} data of object
*/
export const saveContentDataToFileMemory = async (data) => {
  try {
    await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}content`, JSON.stringify(data), { encoding: true });
  } catch (error) {
    // console.log('🚀 ~ file: FileOperation.js:152 ~ saveContentDataToFileMemory ~ error:', error);
  }
};

/**
 * @description this function using for read all prayer data in file systems
 * @param {Array} data of object
*/
export const readContentDataToFileMemory = async () => {
  try {
    const dirs = await readFileDir();
    if (dirs.includes('prayer')) {
      return await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}content/`, { encoding: false });
    }
    return JSON.stringify({});
  } catch (error) {
    // console.log('🚀 ~ file: FileOperation.js:167 ~ readContentDataToFileMemory ~ error:', error);
  }
};
