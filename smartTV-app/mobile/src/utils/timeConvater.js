import moment from 'moment';

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
 * @returns current date
 */
export const getCurrentDate = () => {
  const currentDate = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${currentDate.getDate()}-${monthNames[currentDate.getMonth()]}-${currentDate.getFullYear()}`;
};

/**
 * @param {string} time
 * return converted time
 */
export const timeConvert = (time) => {
  const [hours, minutes, seconds = '0'] = (time || '00:00:00')?.split(':');

  const currentDate = new Date();

  currentDate.setHours(Number(hours));
  currentDate.setMinutes(Number(minutes));
  currentDate.setSeconds(Number(seconds));

  const formattedTime = currentDate.toLocaleString([], {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return formattedTime;
};

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
  const [h, m] = (time || '').split(':');

  const currentDate = new Date();
  currentDate.setHours(Number(h));
  currentDate.setMinutes(Number(m));
  currentDate.setSeconds(0);
  return currentDate.getTime();
}

/**
 * @param {number} minute format 05;
 * @returns  MS;
 */
export function minuteToMS(minute) { return Number(minute) * 60 * 1000; }

/**
 * @description this function using for get current time
 * @returns current time
 */
export function getCurrentTime() {
  const date = new Date();
  const time = date.toLocaleTimeString([], {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
  });

  return time;
}

/**
 * @param {string} time
 * @returns minutes
 */
export const hmToMinutes = (time) => {
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
  }
};
