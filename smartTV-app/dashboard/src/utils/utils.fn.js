import { toast } from 'react-toastify';
import moment from 'moment';

// For random Color
const random = () => Number(Math.random() * 150);
export const randomColor = () => `rgba(${random()},${random()},${random()}, 0.9)`;

export const proxyToNormal = (data) => JSON.parse(JSON.stringify(data));

export const cleanEmptyObjValue = (obj = {}) => {
  const updateData = {};
  for (const key in obj) {
    if (obj[key] !== '' && obj[key] !== '--') updateData[key] = obj[key];
  }
  return updateData;
};

export const copy = async (str) => {
  try {
    await navigator.clipboard.writeText(str);
    toast.success('Copy successful', { position: toast.POSITION.TOP_RIGHT });
  } catch (err) {
    toast.error('Copy unsuccessful', { position: toast.POSITION.TOP_RIGHT });
    console.error(`Error copying text: ${err}`);
  }
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${currentDate.getDate().toString().padStart(2, '00')}-${monthNames[currentDate.getMonth()]}-${currentDate.getFullYear()}`;
};

/**
 * @param {string} shortMonthName
 * @returns number of month
 */
export const getMonthNumber = (shortMonthName) => {
  const months = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec',
  };
  for (const key in months) {
    if (months[key] === shortMonthName) return key;
  }
};

/**
 * @param {string} time
 * return converted time
 */

export function convertTime(timeString) {
  const [hour, minute, second] = timeString?.split(':') || [];
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const formattedTime = `${hour12}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')} ${period}`;
  return timeString === undefined ? '--  -- PM/AM' : formattedTime;
}
export function convertTimeHM(timeString) {
  const [hour, minute] = timeString?.split(':') || [];
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const formattedTime = `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
  return timeString === undefined ? '--  -- PM/AM' : formattedTime;
}

/**
 * @param {string} time format 00:00:00
 * @returns Time MS;
 */
export function timeToMS(time) {
  const [year, month, day] = moment().format('YYYY MM DD').split(' ');
  return new Date(`${year}-${month}-${day}T${time}`).getTime();
}

/**
 * @param {string} time format 00:00:00
 * @returns Time MS;
 *
 */
export function hmTimeToMS(time) {
  const [h, m] = time?.split(':') || [];
  const [year, month, day] = moment().format('YYYY MM DD').split(' ');
  return new Date(`${year}-${month}-${day}T${h}:${m}:00`).getTime();
}

/**
 * @param {number} minute format 05;
 * @returns  MS;
 */
export function minuteToMS(minute) { return Number(minute) * 60 * 1000; }

/**
 * @description convert AM || PM
 * @param {string} h
 * @param {string} m
 * @returns Canvased Time with MP or AM
 */
export const toHM12 = (h, m) => {
  const pmAm = h >= '12' ? 'PM' : 'AM';
  const hour = h > '12' ? h -= '12' : h;
  return `${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${pmAm}`;
};

/**
 * @param {Number} ms
 * @returns Time
 */
export const msToHmTime = (ms) => {
  if (String(ms) === 'NaN') return '-- -- AM/PM';

  const date = new Date(ms);
  const hours = date.getHours();
  const minute = date.getMinutes();
  const time = toHM12(hours, minute);
  return time;
};

export function handleOrgSleepingTv(obj) {
  const timesErr = [];
  const dayNum = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  for (const day of days) {
    const timeObj = {};
    for (const key in obj) {
      if (obj[key]) {
        const time = `${key}:${obj[key]}`;
        if (time.includes(day)) {
          timeObj[key] = obj[key];
        }
      }
    }
    Object.keys(timeObj).length !== 0 && timesErr.push(timeObj);
  }
  const timesData = timesErr.map((data) => {
    const times = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('day')) times.day = dayNum[data[key]];
        if (lowerKey.includes('start')) times.start = data[key];
        if (lowerKey.includes('end')) times.end = String(data[key]);
      }
    }
    return times;
  });

  const mainTime = timesData?.filter((data) => Object.keys(data).length === 3 && data.day >= 0);
  return mainTime;
}
