import CryptoJS from 'crypto-js';
import settings from '../settings';

const videoExtensions = ['.mp4', '.mkv'];
const audioExtensions = ['.mp3'];
const imageExtensions = ['.jpg', '.png', '.jpeg'];
const urlsExtensions = 'http';


export async function categorizeUrls(data = []) {

  let videos = 0;
  let images = 0;
  let urls = 0;
  let audio = 0;

  await data.map(item => {
    if (item?.src) {
      const extension = item?.src.substr(item?.src.lastIndexOf('.'));
      if (item?.src?.includes(urlsExtensions)) urls++;
      else if (videoExtensions.includes(extension)) videos++;
      else if (imageExtensions.includes(extension)) images++;
      else if (audioExtensions.includes(extension)) audio++;
    }
  });

  return { videos, images, urls };
}


/**
 * @param {object} data
 * @returns encrypted token
 */
export const encryptToken = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), settings.secret).toString();
};

/**
 * @param {object} data
 * @returns encrypted token
 */
export const decryptToken = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, settings.secret);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
