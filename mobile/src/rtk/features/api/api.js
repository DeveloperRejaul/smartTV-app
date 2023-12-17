import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@env';
import { saveUser } from '../user/userSlice';
import { handleLogin } from '../auth/authSlice';
import { downloadFile, downloadFiles, saveContentDataToFileMemory, savePrayerDataToFileMemory } from '../../../utils/FileOperation';
import { asyncKeys, contentType } from '../../../constants/constants';
import { updateDate } from '../clock/clockSlice';
import { handleSlide } from '../content/contentSlice';
import { categorizeUrls, cleanEmptyObjValue } from '../../../utils/utils.fn';
import { setAsync, setAsyncData } from '../../../utils/asycSrotegeOpration';
import { format } from '../../../utils/formatData';

export const masjidApi = createApi({
  reducerPath: 'masjidApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),

  endpoints: (builder) => ({

    // login
    login: builder.mutation({
      query: (data) => ({
        url: 'user/login/android',
        method: 'post',
        body: data,
      }),
      transformResponse: (res) => {
        const prayer = res.content.find((d) => d.type === contentType.PRAYER_TIME);
        let prayerTimes = null;
        if (prayer) {
          prayerTimes = prayer.data.map((t) => ({
            fajr: t.fajr,
            syuruk: t.syuruk,
            dhuhr: t.dhuhr,
            asr: t.asr,
            maghrib: t.maghrib,
            isha: t.isha,
            date: t.date,
            hijri: t.hijri,
          }));
        }

        const content = res.content.map((d) => cleanEmptyObjValue({
          id: d._id,
          src: d?.src || '',
          startTime: d?.startTime || '',
          endTime: d?.endTime || '',
          type: d?.type || '',
          waqto: d?.waqto || '',
          layout: d?.layout || '',
          dateRange: d?.dateRange || '',
          days: d?.days || '',
          audio: d.audioSrc || '',
          slides: d.slidePhotos || '',
          eventName: d?.eventName || '',
          slideType: d?.slideType,
        }));
        const user = res?.user;
        const token = res?.token;
        return { user, token, content, prayerTimes };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: { content, prayerTimes, user, token } } = await queryFulfilled;
          const file = await downloadFile(user?.org?.avatar);

          await dispatch(saveUser({ data: user.org, avatar: file }));
          await setAsync(JSON.stringify({ ...user.org, file }));
          await setAsyncData(asyncKeys.token, token);
          const sliderUrls = await content?.filter((d) => d.type === contentType.SLIDE);
          const slide = await content?.filter((d) => d.type === contentType.SLIDE).map((d) => cleanEmptyObjValue(format.slideData(d)));
          const sliderImageUrls = sliderUrls.map((d) => d.src);

          await downloadFiles(sliderImageUrls);
          await savePrayerDataToFileMemory(prayerTimes);
          await saveContentDataToFileMemory(content);
          await dispatch(await handleSlide(categorizeUrls(slide)));
          dispatch(handleLogin());
          dispatch(updateDate());
        } catch (error) {
          // console.log(`print from api file : ${JSON.stringify(error)}`);
        }
      },
    }),
  }),
});

export const { useLoginMutation } = masjidApi;
