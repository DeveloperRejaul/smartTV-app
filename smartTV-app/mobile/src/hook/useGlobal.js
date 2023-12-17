import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppState } from 'react-native';
import { socketAction } from '../constants/socketAction';
import { deleteFile, deleteSingleFile, downloadFile, readContentDataToFileMemory, readPrayerDataToFileMemory, saveContentDataToFileMemory, savePrayerDataToFileMemory } from '../utils/FileOperation';
import { deleteAsync, getAsync, getAsyncData, setAsync } from '../utils/asycSrotegeOpration';
import { saveUser } from '../rtk/features/user/userSlice';
import { updateDate } from '../rtk/features/clock/clockSlice';
import { updateBlink, updateScreen } from '../rtk/features/screen/screenSlice';
import { handleAddSlide, handleContents, handleDeleteSlide, handleTodayPrayer, handleUpdateSlide, updatePrayerTime, updateTimes } from '../rtk/features/content/contentSlice';
import { asyncKeys, contentType } from '../constants/constants';
import { updateColors, updateFonts } from '../rtk/features/theme/themeSlice';
import { format } from '../utils/formatData';
import { socketConnect } from '../utils/socketConnect';

const { SYURUK_COUNTDOWN, SYURUK_END, SYURUK_MAIN } = contentType;
const syurukContent = [SYURUK_COUNTDOWN, SYURUK_END, SYURUK_MAIN];

export function useGlobal() {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

/**
 * =================================================================
 * @description handle App active | inactive | socket events
 * =================================================================
*/
  useEffect(() => {
    // HANDLE APP STATE
    const appState = AppState.addEventListener('change', async (state) => {
      switch (state) {
      case 'background':
        socket?.disconnect();
        break;
      case 'inactive':
        socket?.disconnect();
        break;
      case 'active':
        const token = await getAsyncData(asyncKeys.token);
        if (!socket?.connected && token) {
          const { socket } = socketConnect(token);
          setSocket(socket);
        }
        break;
      default:
        break;
      }
    });

    return () => appState.remove();
  }, [socket]);

/**
 * =======================================
 * @description handle all socket events
 * =======================================
*/

  useEffect(() => {
    // handle socket content crud operation
    socket?.on(socketAction.CONTENT, async (data) => {
      try {
        switch (data.type) {
        case 'POST':
          if (data.data.type === contentType.PRAYER_TIME) {
            const prayer = data.data.data.map((t) => ({
              fajr: t.fajr,
              syuruk: t.syuruk,
              dhuhr: t.dhuhr,
              asr: t.asr,
              maghrib: t.maghrib,
              isha: t.isha,
              date: t.date,
            }));
            await savePrayerDataToFileMemory(prayer);
            const res = await readPrayerDataToFileMemory();
            const times = JSON.parse(res);
            const orgData = JSON.parse(await getAsync());
            dispatch(handleTodayPrayer({ times, offset: orgData.offset }));
          } else if (data.data.type === contentType.SLIDE) {
            // handle add new slide data
            const { data: d } = data;
            const content = format.slideData(d);
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const updatedContent = [...newContents, content];
            await saveContentDataToFileMemory(updatedContent);
            await dispatch(handleAddSlide(d));
          } else if (data?.data?.type === contentType.SALAT_SLIDE) {
            const salatSlide = data?.data?.slidePhotos;
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const slidesData = { id: data.data._id, startTime: data.data?.startTime, audio: data.data?.audioSrc, slides: salatSlide, type: data.data.type, waqto: data.data?.waqto };
            const updatedContent = [...newContents, slidesData];
            await saveContentDataToFileMemory(updatedContent);
            dispatch(handleContents(updatedContent));
          } else if (data?.data?.type === contentType.SALAT) {
            const { data: d } = data;
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const newContent = { id: d._id, audio: d.audioSrc || '', src: d.src || '', startTime: d.startTime || '', type: d.type, waqto: d.waqto || '' };
            const updatedContent = [...newContents, newContent];
            await saveContentDataToFileMemory(updatedContent);
            dispatch(handleContents(updatedContent));
          } else if (syurukContent.includes(data?.data?.type)) {
            const { data: d } = data;
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const newContent = { id: d._id, audio: d.audioSrc || '', src: d.src || '', startTime: d.startTime || '', type: d.type, waqto: d.waqto || '' };
            const updatedContent = [...newContents, newContent];
            await saveContentDataToFileMemory(updatedContent);
            dispatch(handleContents(updatedContent));
          } else {
            // handle new content create operation
            const { data: d } = data;
            const content = { id: d._id, src: d?.src || '', startTime: d?.startTime || '', type: d?.type || '', waqto: d?.waqto || '', layout: d?.layout || '', audio: d?.audioSrc || '', endTime: d?.endTime || '' };
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const updatedContent = [...newContents, content];
            await saveContentDataToFileMemory(updatedContent);
            dispatch(handleContents(updatedContent));
          }
          if (data?.data?.src) await downloadFile(data?.data?.src);
          break;
        case 'UPDATE':
          if (data.data.type === contentType.PRAYER_TIME) {
            // handle prayer time update operation
            const prayer = data.data.data.map((t) => ({ fajr: t.fajr, syuruk: t.syuruk, dhuhr: t.dhuhr, asr: t.asr, maghrib: t.maghrib, isha: t.isha, date: t.date }));
            await savePrayerDataToFileMemory(prayer);
            const res = await readPrayerDataToFileMemory();
            const times = JSON.parse(res);
            const orgData = JSON.parse(await getAsync());
            dispatch(handleTodayPrayer({ times, offset: orgData.offset }));
          } else if (data.data.type === contentType.SLIDE) {
            // handle update slide data
            const { data: d } = data;
            const content = format.slideData(d);
            const contents = JSON.parse(await readContentDataToFileMemory());
            const updatedContent = await contents.filter((con) => con.id !== content.id);
            const newUpdatedContent = await [...updatedContent, content];
            await saveContentDataToFileMemory(newUpdatedContent);
            await dispatch(handleUpdateSlide(d));
          } else if (data?.data?.type === contentType.SALAT_SLIDE) {
            const salatSlide = data?.data?.slidePhotos;
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const slidesData = { id: data.data._id, startTime: data.data?.startTime, audio: data.data?.audioSrc, slides: salatSlide, type: data.data.type, waqto: data.data?.waqto };
            const newUpdatedContent = newContents.filter((con) => con?.id !== data.data?._id);
            const updatedContent = [...newUpdatedContent, slidesData];
            await saveContentDataToFileMemory(updatedContent);
            dispatch(handleContents(updatedContent));
          } else if (data?.data?.type === contentType.SALAT) {
            const { data: d } = data;
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const newContent = { id: d._id, audio: d.audioSrc || '', src: d.src || '', startTime: d.startTime || '', type: d.type, waqto: d.waqto || '' };
            const updatedContent = newContents.filter((con) => con.id !== d._id);
            const newUpdatedContent = [...updatedContent, newContent];
            await saveContentDataToFileMemory(newUpdatedContent);
            dispatch(handleContents(newUpdatedContent));
          } else if (syurukContent.includes(data?.data?.type)) {
            const { data: d } = data;
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const newContent = { id: d._id, audio: d.audioSrc || '', src: d.src || '', startTime: d.startTime || '', type: d.type, waqto: d.waqto || '' };
            const newUpdatedContent = newContents.filter((con) => con.id !== d._id);
            const updatedContent = [...newUpdatedContent, newContent];
            await saveContentDataToFileMemory(updatedContent);
            dispatch(handleContents(updatedContent));
          } else {
            // handle content update operation
            const { data: d } = data;
            const content = { id: d._id, src: d?.src || '', startTime: d?.startTime || '', type: d?.type || '', waqto: d?.waqto || '', layout: d?.layout || '', audio: d?.audioSrc || '', endTime: d?.endTime || '' };
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const updatedContent = newContents.filter((con) => con.id !== d._id);
            const newUpdatedContents = [...updatedContent, content];
            await saveContentDataToFileMemory(newUpdatedContents);
            dispatch(handleContents(newUpdatedContents));
          }
          if (data?.data?.src) {
            await deleteSingleFile(data?.data?.src);
            await downloadFile(data?.data?.src);
          }
          break;
        case 'DELETE':
          if (data.data.type === contentType.PRAYER_TIME) {
            // // handle prayer time delete operation
            await deleteFile('prayer');
            dispatch(updateTimes([]));
            dispatch(updatePrayerTime([]));
          } else if (data.data.type === contentType.SLIDE) {
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const updatedContent = newContents.filter((con) => con.id !== data.data._id);
            await saveContentDataToFileMemory(updatedContent);
            dispatch(handleDeleteSlide(data.data));
          } else if (data?.data?.type === contentType.SALAT_SLIDE) {
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const newUpdatedContent = await newContents.filter((con) => con?.id !== data?.data?._id);
            await saveContentDataToFileMemory(newUpdatedContent);
            await dispatch(handleContents(newUpdatedContent));
          } else if (data?.data?.type === contentType.SALAT) {
            const { data: d } = data;
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const updatedContent = newContents.filter((con) => con.id !== d._id);
            await saveContentDataToFileMemory(updatedContent);
            dispatch(handleContents(updatedContent));
          } else if (syurukContent.includes(data?.data?.type)) {
            const { data: d } = data;
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const newUpdatedContent = newContents.filter((con) => con.id !== d._id);
            await saveContentDataToFileMemory(newUpdatedContent);
            dispatch(handleContents(newUpdatedContent));
          } else {
            // handle content delete operation
            const contents = await readContentDataToFileMemory();
            const newContents = JSON.parse(contents);
            const updatedContent = newContents.filter((con) => con.id !== data.data._id);
            await saveContentDataToFileMemory(updatedContent);
            dispatch(handleContents(updatedContent));
          }
          if (data?.data?.src) await deleteSingleFile(data?.data?.src);
          break;

        default:
          break;
        }
      } catch (error) {
        // console.log(error);
      }
    });

    // handle socket organization crud operation
    socket?.on(socketAction.UPDATE_ORG, async (data) => {
      // update hijiri date
      dispatch(updateDate(data.adjustment.hijridate));

      // update blink azan time animation
      dispatch(updateBlink(data.blinksBeforeAzan));

      // update screens of/on state
      dispatch(updateScreen(data.screen));

      // update theme slice colors
      if (data?.theme?.colors) dispatch(updateColors(data?.theme?.colors));

      // update theme slice fonts
      if (data?.theme?.fonts)dispatch(updateFonts(data?.theme?.fonts));

      const times = JSON.parse(await readPrayerDataToFileMemory());
      dispatch(handleTodayPrayer({ times, offset: data.offset }));
      const avatar = await downloadFile(data?.avatar);
      await deleteAsync();
      await setAsync(JSON.stringify({ ...data, file: avatar }));

      // update user state
      dispatch(saveUser({ data, avatar }));
    });

    return () => {
      socket?.off(socketAction.CONTENT); socket?.off(socketAction.UPDATE_ORG);
    };
  }, [socket]);

  return { socket, setSocket };
}
