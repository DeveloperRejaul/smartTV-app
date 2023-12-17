import moment from 'moment';
import { contentType, waqto } from '../constants/constants';
import { getCurrentDate, minuteToMS, msToHmTime } from './utils.fn';

export class PrayerTimes {
  constructor(times) {
    this.times = times;
  }

  async getPreyerTime() {
    let prayerData = {};
    // subu times
    let subuhAzanCountdown = 0;
    let subuhAzan = 0;
    let subuhIqomahCountduown = 0;

    // zohor
    let zohorAzanCountdown = 0;
    let zohorAzan = 0;
    let zohorIqomahCountduown = 0;

    // asr
    let asrAzanCountdown = 0;
    let asrAzan = 0;
    let asrIqomahCountduown = 0;

    // maghrib
    let maghribAzanCountdown = 0;
    let maghribAzan = 0;
    let maghribIqomahCountduown = 0;

    // isha
    let ishaAzanCountdown = 0;
    let ishaAzan = 0;
    let ishaIqomahCountduown = 0;

    const nowDate = getCurrentDate();
    await this.times.forEach(async (data) => {
      if (data.waqto === waqto.SUBUH) {
        if (data.type === contentType.AZAN_COUNT_DOWN) subuhAzanCountdown = +data?.startTime;
        if (data.type === contentType.AZAN) subuhAzan = +data?.startTime;
        if (data.type === contentType.IQOMAH_COUNTDOWN) subuhIqomahCountduown = +data?.startTime;
      }
      if (data.waqto === waqto.ZOHOR) {
        if (data.type === contentType.AZAN_COUNT_DOWN) zohorAzanCountdown = +data?.startTime;
        if (data.type === contentType.AZAN) zohorAzan = +data?.startTime;
        if (data.type === contentType.IQOMAH_COUNTDOWN) zohorIqomahCountduown = +data?.startTime;
      }
      if (data.waqto === waqto.ASAR) {
        if (data.type === contentType.AZAN_COUNT_DOWN) asrAzanCountdown = +data?.startTime;
        if (data.type === contentType.AZAN) asrAzan = +data?.startTime;
        if (data.type === contentType.IQOMAH_COUNTDOWN) asrIqomahCountduown = +data?.startTime;
      }

      if (data.waqto === waqto.MAGHRIB) {
        if (data.type === contentType.AZAN_COUNT_DOWN) maghribAzanCountdown =+data?.startTime;
        if (data.type === contentType.AZAN) maghribAzan = +data?.startTime;
        if (data.type === contentType.IQOMAH_COUNTDOWN) maghribIqomahCountduown = +data?.startTime;
      }
      if (data.waqto === waqto.ISYAK) {
        if (data.type === contentType.AZAN_COUNT_DOWN) ishaAzanCountdown = +data?.startTime;
        if (data.type === contentType.AZAN) ishaAzan = +data?.startTime;
        if (data.type === contentType.IQOMAH_COUNTDOWN) ishaIqomahCountduown = +data?.startTime;
      }

      //
      const todayPrayerTime = await data?.data?.filter((d) => d.date === nowDate)[0];

      if (todayPrayerTime) {
        const { asr, dhuhr, fajr, isha, maghrib }= todayPrayerTime || {};

        // fajar times
        const fajrAzanTime = msToHmTime(this.hmTimeToMS(fajr) + minuteToMS(subuhAzanCountdown));
        const fajrIqomahTime = msToHmTime(this.hmTimeToMS(fajrAzanTime) + minuteToMS(subuhAzan) + minuteToMS(subuhIqomahCountduown));

        // zohor times
        const zohorAzanTime = msToHmTime(this.hmTimeToMS(dhuhr) + minuteToMS(zohorAzanCountdown));
        const zohorIqomahTime = msToHmTime(this.hmTimeToMS(zohorAzanTime) + minuteToMS(zohorAzan) + minuteToMS(zohorIqomahCountduown));

        // asr times
        const asrAzanTime = msToHmTime(this.hmTimeToMS(asr) + minuteToMS(asrAzanCountdown));
        const asrIqomahTime = msToHmTime(this.hmTimeToMS(asrAzanTime) + minuteToMS(asrAzan) + minuteToMS(asrIqomahCountduown));

        // maghrib times
        const maghribAzanTime = msToHmTime(this.hmTimeToMS(maghrib) + minuteToMS(maghribAzanCountdown));
        const maghribIqomahTime = msToHmTime(this.hmTimeToMS(maghribAzanTime) + minuteToMS(maghribAzan) + minuteToMS(maghribIqomahCountduown));

        // isha times
        const ishaAzanTime = msToHmTime(this.hmTimeToMS(isha) + minuteToMS(ishaAzanCountdown));
        const ishaIqomahTime = msToHmTime(this.hmTimeToMS(ishaAzanTime) + minuteToMS(ishaAzan) + minuteToMS(ishaIqomahCountduown));

        prayerData = { fajrAzanTime, fajrIqomahTime, zohorAzanTime, zohorIqomahTime, asrAzanTime, asrIqomahTime, maghribAzanTime, maghribIqomahTime, ishaAzanTime, ishaIqomahTime, todayPrayerTime };
      }
    });

    if (prayerData) return prayerData;
  }

  hmTimeToMS(time) {
    const [h, m] = time?.split(':') || [];
    const [year, month, day] = moment().format('YYYY MM DD').split(' ');
    return new Date(`${year}-${month}-${day}T${h}:${m.slice(0, 2)}:00`).getTime();
  }
}
