import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { runOnUI } from 'react-native-reanimated';
import { getCurrentTime, hmTimeToMS } from '../utils/timeConvater';
import { asyncKeys, contentType, navigationType, parayerTime, prayerNavigation, syurukNavigation } from '../constants/constants';
import { handleContents, handleTodayPrayer, updateActiveContent, updatePrayerTime, updateTimes } from '../rtk/features/content/contentSlice';
import { categorizeUrls, dateRangeCheck } from '../utils/utils.fn';
import { checkEqual } from '../utils/selectorCheck';
import { activeTime, formatPrayerTime } from '../utils/prayerTime';
import { handleAzanIqomahGap, updateNavigation, updatePrayerNavigation, updateSyurukNavigation } from '../rtk/features/navigation/navigationSlice';
import { updateDate } from '../rtk/features/clock/clockSlice';
import { readContentDataToFileMemory, readPrayerDataToFileMemory } from '../utils/FileOperation';
import { getAsync, getAsyncData } from '../utils/asycSrotegeOpration';

let interval;
const INTERVAL_DURATION = 1000;
const next = new Date();

export default () => {
  const { currentTime } = useSelector((state) => state.clock, shallowEqual);
  const { nextPrayerTime, todayPrayerTimes, contents, activePrayerTime } = useSelector((state) => state.content, checkEqual);
  const { sleepingDate, sleepingDay } = useSelector((state) => state.user, checkEqual);
  const azanIqomahGap = useSelector((state) => state.navigation.azanIqomahGap);
  const dispatch = useDispatch();

  // salat time handle and next prevues current and active prayer content update
  useEffect(() => {
    const updatedTime = activeTime(formatPrayerTime(todayPrayerTimes), getCurrentTime());

    dispatch((dis, getState) => {
      const timesContent = JSON.stringify(getState().content.times);
      const updatedTimeContent = JSON.stringify(updatedTime);

      if (timesContent !== updatedTimeContent) {
        // update salat time
        dis(updateTimes(updatedTime));

        // update prayer time: next | prev | current
        dis(updatePrayerTime(updatedTime));

        // update active prayer content
        const activePrayerName = updatedTime.find((waqto) => waqto?.active)?.name;
        const activeContent = contents.filter((con) => con?.waqto === parayerTime[activePrayerName]);
        dispatch(updateActiveContent(activeContent));
      }
    });

    // handle sleeping time and screen
    if (dateRangeCheck(sleepingDate)) {
      const day = (new Date()).getDay().toString();
      const activeSleeping = (sleepingDay || []).filter((dayObj) => dayObj.day === day)[0];
      const startTime = activeSleeping?.start;

      if (hmTimeToMS(getCurrentTime()) === hmTimeToMS(startTime)) {
        dispatch(updateNavigation(navigationType.SLEEP));
      }
    }
  }, [currentTime, todayPrayerTimes]);

  // screen handle
  useEffect(() => {
    if (nextPrayerTime?.name) {
      const nextPrayerContent = contents.filter((con) => con.waqto === parayerTime[nextPrayerTime?.name]);
      let countdownTime;
      if (nextPrayerTime?.name === 'syuruk') {
        countdownTime = nextPrayerContent.find((con) => con.type === contentType.SYURUK_COUNTDOWN)?.startTime;
      } else {
        countdownTime = nextPrayerContent.find((con) => con.type === contentType.AZAN_COUNTDOWN)?.startTime;
      }
      // find next prayer azan countdown content
      const [hours, minutes, second] = nextPrayerTime?.time?.split(':').map(Number) || [];
      next.setHours(hours);
      next.setMinutes(minutes);
      next.setSeconds(second);

      const nextTime = Math.floor((next.getTime() - countdownTime) / 1000);
      clearInterval(interval);

      runOnUI(() => {
        interval = setInterval(() => {
          const nowTime = Math.floor(new Date().getTime() / 1000);
          // console.log(`now time: ${nowTime} , next time: ${nextTime} ====   ${nowTime === nextTime}`);

          if (nowTime === nextTime) {
            if (nextPrayerTime?.name === 'syuruk') {
              dispatch(updateSyurukNavigation(syurukNavigation.COUNDOWN));
              dispatch(updateNavigation(navigationType.SYURUK));
            } else {
              dispatch(updatePrayerNavigation(prayerNavigation.AZAN_COUNTDOWN));
              dispatch(updateNavigation(navigationType.PRAYER));
            }
          }
        }, INTERVAL_DURATION);
      })();

      // console.log(`next prayer time: ${nextPrayerTime?.time} name: ${nextPrayerTime?.name} countdown time: ${countdownTime} ==> print from useControlScreen hook`);
    }
    return () => { clearInterval(interval); };
  }, [nextPrayerTime, todayPrayerTimes]);

  // handle azan gap/iquomah gap time
  useEffect(() => {
    const day = new Date().getDay();
    const duration = Math.abs(azanIqomahGap);

    if (azanIqomahGap) {
      // console.log(duration);
      // console.log('gap');
      setTimeout(() => {
        if (day === 5 && activePrayerTime[0].name === 'dhuhr') {
          // console.log('Khotbah');
          dispatch(updatePrayerNavigation(prayerNavigation.KHOTBAH));
          dispatch(updateNavigation(navigationType.PRAYER));
          dispatch(handleAzanIqomahGap(null));
        } else {
          // console.log('iqomah countdown');
          dispatch(updatePrayerNavigation(prayerNavigation.IQOMAH_COUNTDOWN));
          dispatch(updateNavigation(navigationType.PRAYER));
          dispatch(handleAzanIqomahGap(null));
        }
      }, duration);
    }
  }, [azanIqomahGap]);

  // update date , slide data after 24 hours
  // update hijri date after magrib
  useEffect(() => {
    (async () => {
      if (currentTime === '00:01') {
        dispatch(updateDate());
        const res = await readPrayerDataToFileMemory();
        const contents = await readContentDataToFileMemory();
        const newContents = JSON.parse(contents);
        const times = JSON.parse(res);
        const orgData = JSON.parse(await getAsync());
        dispatch(handleTodayPrayer({ times, offset: orgData.offset }));
        dispatch(handleContents(categorizeUrls(newContents)));
      }

      // update hijri date after magrib
      if (activePrayerTime[0]?.name === 'maghrib' || activePrayerTime[0]?.name === 'isha') {
        const orgData = JSON.parse(await getAsyncData(asyncKeys.masjid));
        const updatedDate = orgData.adjustment.hijridate + 1;
        dispatch(updateDate(updatedDate));
      }
    })();
  }, [currentTime]);
};
