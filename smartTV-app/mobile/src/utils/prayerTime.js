import { timeToMS } from './timeConvater';

const withOutData = ['hijri', 'day', 'date', '_id', 'imsak'];
/**
 * @param {string} times
 * @returns format time for ui
 */
export function formatPrayerTime(times) {
  const timesArray = [];
  const timeObj = times[0];

  for (const key in timeObj) {
    if (!withOutData.includes(key)) {
      timesArray.push({ name: key, time: timeObj[key], active: false });
    }
  }
  return timesArray;
}

/**
 * @param {string} prayTime
 * @param {string} cTime
 * @returns active time
 */
let activePrayerTime = null;
export const activeTime = (prayTime, currentTime) => {
  prayTime.sort((a, b) => timeToMS(a.time) - timeToMS(b.time));

  for (const prayer of prayTime) {
    const currentTimeMS = timeToMS(currentTime);
    const prayerTimeMS = timeToMS(prayer.time);

    // DOTO active time detect problems
    if (currentTimeMS >= prayerTimeMS) {
      activePrayerTime = prayer.time;
    } else { break; }
  }

  const updatedTime = prayTime.map((d) => {
    if (d.time === activePrayerTime) {
      return { ...d, active: true };
    }
    return { ...d, active: false };
  });

  return updatedTime;
};
