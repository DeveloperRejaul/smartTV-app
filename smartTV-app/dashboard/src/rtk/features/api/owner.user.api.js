import { api } from './api';
import { userType } from '../../../constants/constants';
import { PrayerTimes } from '../../../utils/PrayerTimes';
import { convertTimeHM } from '../../../utils/utils.fn';

export const ownerUserApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => `user/organization/${id}`,
      transformResponse: (res) => {
        const admins = res?.filter((d) => d.userType === userType.admin);
        const users = res?.filter((d) => d.userType === userType.user);
        return { users, admins, totalUser: users?.length, totalAdmin: admins.length };
      },
    }),

    // get all content for masjid ownerSS
    getContent: builder.query({
      query: (id) => `content/${id}?paginate=false`,
      transformResponse: async (res) => {
        try {
          const times = new PrayerTimes(res);
          const { todayPrayerTime: prayerTimes, fajrAzanTime, fajrIqomahTime, zohorAzanTime, zohorIqomahTime, asrAzanTime, asrIqomahTime, maghribAzanTime, maghribIqomahTime, ishaAzanTime, ishaIqomahTime } = await times.getPreyerTime() || {};
          const { asr, dhuhr, fajr, isha, maghrib, syuruk } = prayerTimes || {};

          // TODO
          const time = [
            { name: 'SUBUH', time: fajr, iqomah: fajrIqomahTime || '-- AM/PM', azan: fajrAzanTime || '-- AM/PM' },
            { name: 'SYURUK', time: syuruk, iqomah: convertTimeHM(dhuhr) || '-- AM/PM', azan: convertTimeHM(syuruk) || '-- AM/PM' },
            { name: 'ZOHOR', time: dhuhr, iqomah: zohorIqomahTime || '-- AM/PM', azan: zohorAzanTime || '-- AM/PM' },
            { name: 'ASAR', time: asr, iqomah: asrIqomahTime || '-- SAM/PM', azan: asrAzanTime || '-- AM/PM' },
            { name: ' MAGHRIB', time: maghrib, azan: maghribAzanTime || '-- AM/PM', iqomah: maghribIqomahTime || '-- AM/PM' },
            { name: 'ISYAK', time: isha, azan: ishaAzanTime || '-- AM/PM', iqomah: ishaIqomahTime || '-- AM/PM' },
          ];

          return { contents: res, totalContent: res?.length, prayerTimes, time };
        } catch (error) {
          //console.log(error);
        }
      },
    }),
  }),
});

export const {
  useGetUserQuery, useGetContentQuery,
} = ownerUserApi;
