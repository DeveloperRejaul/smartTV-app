import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { saveUser } from '../../rtk/features/user/userSlice';
import { useAppContext } from '../../context/masjidContext';
import useControlScreen from '../../hook/useControlScreen';
import { readContentDataToFileMemory, readPrayerDataToFileMemory } from '../../utils/FileOperation';
import { updateDate, updateTime } from '../../rtk/features/clock/clockSlice';
import { asyncKeys, contentType, navigationType } from '../../constants/constants';
import RootPrayer from '../prayerRoot/PrayerRoot';
import Sleep from '../sleep/Sleep';
import CustomSlider from '../../components/customSlider/Slider';
import { handleContents, handleSlide, handleTodayPrayer } from '../../rtk/features/content/contentSlice';
import { categorizeUrls } from '../../utils/utils.fn';
import Syuruk from '../syuruk/Syuruk';
import { getAsync, getAsyncData } from '../../utils/asycSrotegeOpration';
import { getCurrentTime } from '../../utils/timeConvater';
import { updateBlink, updateScreen } from '../../rtk/features/screen/screenSlice';
import { updateColors, updateFonts } from '../../rtk/features/theme/themeSlice';
import { socketConnect } from '../../utils/socketConnect';

let intervalId;
let timeoutTime;
const durationTime = 1000;

const components = {
  [navigationType.HOME]: <CustomSlider />,
  [navigationType.PRAYER]: <RootPrayer />,
  [navigationType.SLEEP]: <Sleep />,
  [navigationType.SYURUK]: <Syuruk />,
};

export default function Home() {
  useControlScreen();

  const dispatch = useDispatch();
  const { socket, setSocket } = useAppContext();
  const screen = useSelector((state) => state.navigation.screen);

  // update time and date and content
  useEffect(() => {
    // handle time data
    dispatch(updateTime());

    // handle clock time its call 1 minute interval
    timeoutTime = setInterval(() => {
      dispatch((dis, getState) => {
        const clock = getState().clock.currentTime;
        const currentTime = getCurrentTime();
        if (currentTime !== clock) dis(updateTime(currentTime));
      });
    }, durationTime);

    (async () => {
      try {
        // socket reconnection
        const token = await getAsyncData(asyncKeys.token);
        if (!socket && token) {
          const { socket } = socketConnect(token);
          setSocket(socket);
        }

        // save data to memory
        const res = await readPrayerDataToFileMemory();
        const content = await readContentDataToFileMemory();
        const times = JSON.parse(res);
        const newContent = JSON.parse(content);
        const slides = newContent.filter((con) => con.type === contentType.SLIDE);

        dispatch(handleContents(newContent));
        dispatch(handleSlide(categorizeUrls(slides)));

        const userData = JSON.parse(await getAsync());
        dispatch(handleTodayPrayer({ times, offset: userData.offset }));
        // handle hijiri date
        dispatch(updateDate(userData.adjustment.hijridate));

        // update blink azan time animation
        dispatch(updateBlink(userData.blinksBeforeAzan));

        // update screens of/on state
        await dispatch(updateScreen(userData.screen));

        // update theme slice colors state
        if (userData?.theme?.colors) await dispatch(updateColors(userData?.theme?.colors));

        // update theme slice fonts state
        if (userData?.theme?.fonts) await dispatch(updateFonts(userData?.theme?.fonts));

        await dispatch(saveUser({ data: userData, avatar: userData.file }));
      } catch (error) {
        // console.log('🚀 ~ file: index.jsx:76 ~ error:', error);
      }
    })();

    return () => {
      clearInterval(timeoutTime);
      clearInterval(intervalId);
    };
  }, []);

  return components[screen];
}
