import { getCurrentDate, getMonthNumber } from './timeConvater';

let count = 0;

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

/**
 * @param {string } inputTime time
 * @returns increment time
 */
export function incrementTime(inputTime) {
  count++;
  const [day, month, year] = getCurrentDate().split('-');
  const inputDate = new Date(`${year}-${getMonthNumber(month)}-${day}T${inputTime}Z`);
  const updatedDate = addMinutes(inputDate, count);

  const formattedTime = updatedDate.toLocaleDateString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return formattedTime.split(',')[1].trim().split(' ')[0];
}
