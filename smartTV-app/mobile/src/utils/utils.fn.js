/**
 * @description this function using for check content now date exits
 * @param {Array} dateRange
 * @returns {boolean}
 */
export const dateRangeCheck = (dateRange) => {
  const currentDate = new Date().getTime() + 60000;
  if (dateRange === undefined) return false;

  if (dateRange.length === 2) {
    if (dateRange[0] !== '' && dateRange[1] !== '') {
      const startDate = new Date(dateRange[0]).getTime();
      const endDate = new Date(dateRange[1]).getTime();
      if (currentDate >= startDate && currentDate <= endDate) {
        return true;
      }
      return false;
    }
    return false;
  }
};

/**
 * @description slide category serialize with urls
 * @param {Array} data
 * @returns array of object
 */

export function categorizeUrls(data = []) {
  const videoExtensions = ['.mp4', '.mkv'];
  const imageExtensions = ['.jpg', '.png'];
  const day = new Date().getDay();

  return data.filter((d) => dateRangeCheck(d?.dateRange) && d?.days?.includes(day)).map((item) => {
    if (dateRangeCheck(item?.dateRange) && item?.days?.includes(day)) {
      const url = item.src;
      const newItem = { src: item.src.replace('upload/', '') };
      if (item.slideType === 'eventCountdown') {
        newItem.type = item.slideType || '';
        newItem.eventName = item.eventName || '',
        newItem.src = item.src || '';
        newItem.layout = item?.layout || 'one';
        newItem.id = item?.id || '';
        newItem.audio = item.audio || '';
        newItem.duration = item.startTime || '';
        newItem.endDate = item.dateRange[1] || '';
      } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const regX = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&\n?#]+)/;

        const youtubeId = url.match(regX);
        newItem.type = 'youtube';
        newItem.src = youtubeId[1];
        newItem.layout = item?.layout || 'one';
        newItem.id = item?.id;
        newItem.audio = item.audio || '';
        newItem.duration = item.startTime || '';
      } else {
        const extension = url?.substr(url?.lastIndexOf('.'));

        if (videoExtensions.includes(extension)) {
          if (url.includes('upload/')) {
            newItem.type = 'video';
            newItem.layout = item?.layout || 'one';
            newItem.id = item?.id;
            newItem.audio = item.audio || '';
            newItem.duration = item.startTime || '';
          } else {
            newItem.type = 'video';
            newItem.layout = item?.layout || 'one';
            newItem.id = item?.id;
            newItem.audio = item.audio || '';
            newItem.duration = item.startTime || '';
            newItem.src = item?.src ?? '';
          }
        } else if (imageExtensions.includes(extension)) {
          newItem.type = 'image';
          newItem.layout = item?.layout || 'one';
          newItem.id = item?.id;
          newItem.audio = item.audio || '';
          newItem.duration = item.startTime || '';
        }
      }
      return newItem;
    }
  });
}

/**
 * @description this function check url type
 * youtube url or video url
 * @param {string} url
 * @returns object {src:"url", type:"video||youtube"}
 */
export const findUrlType = (url) => {
  const videoExtensions = ['.mp4', '.mkv'];
  const imageExtensions = ['.jpg', '.png'];

  const youtubeExtensions = ['youtube.com', 'youtu.be'];
  const regX = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&\n?#]+)/;
  const extension = url?.substring(url?.lastIndexOf('.'));
  const urlObj = {};

  if (videoExtensions.includes(extension)) {
    urlObj.type = 'video';
    urlObj.src = url;
  } else if (youtubeExtensions.some((extension) => url?.includes(extension))) {
    const youtubeId = url.match(regX);
    urlObj.type = 'youtube';
    urlObj.src = youtubeId[1];
  } else if (imageExtensions.includes(extension)) {
    urlObj.type = 'image';
    urlObj.src = url;
  }

  return urlObj;
};

/**
 * @param {string } keys key like this "name email"
 * @param {Array } data array Object
 * @description reduce object only take provided key
 * @returns array of reduced object
 */
export const arrayOfObjReducer = ({ keys, data }) => {
  const acceptKey = keys.split(' ');

  const formattedResults = [];
  for (const obj of data) {
    const demoObj = {};
    for (const key in obj) {
      if (acceptKey.includes(key)) {
        demoObj[key] = obj[key];
      }
    }
    formattedResults.push(demoObj);
  }
  return formattedResults;
};

/**
 * @param {String} time
 * @param {String} minute
 * @description decrees time with minute
 * @returns decreased time
 */
export const decreesTimeToMinute = (time, minute) => {
  if (time) {
    const [hours, minutes] = time?.split(':');
    const totalMinutes = Number(hours) * 60 + Number(minutes);
    const decreasedMinutes = totalMinutes - Number(minute);
    const newHours = Math.floor(decreasedMinutes / 60);
    const newMinutes = decreasedMinutes % 60;

    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  }
};

/**
 * @param {object} obj
 * @description this function using for clear empty object value
 * @returns object
 */
export const cleanEmptyObjValue = (obj = {}) => {
  const updateData = {};
  for (const key in obj) {
    if (obj[key] !== '') updateData[key] = obj[key];
  }
  return updateData;
};

/**
 * @param {string} time
 * @param {string} offset
 * @description this function calculate time offset
 * @returns calculated time
 */

export const offsetCalculate = (time, offset) => {
  const [hours, minutes, seconds] = time.split(':').map(Number);

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const d = date.getDate();
  const totalMinutes = offset >= 0 ? minutes + Math.abs(offset) : minutes - Math.abs(offset);

  const result = new Date(year, month, d, hours, totalMinutes, seconds).toTimeString();
  return result.slice(0, 8);
};
