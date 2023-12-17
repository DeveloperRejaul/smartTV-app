export const headerHeight = 40;
export const baseUrl = import.meta.env.VITE_BASE_URL;
export const socketUrl = import.meta.env.VITE_SOCKET_URL;
export const MeUrl = import.meta.env.VITE_ME_URL;

export const userType = { supperAdmin: 'supper-admin', masjidOwner: 'masjid-owner', admin: 'admin', user: 'user' };
export const sortBy = { asc: 'asc', desc: 'desc' };
export const contentType = { SLIDE: 'slide', AZAN_COUNT_DOWN: 'azanCountdown', AZAN: 'azan', IQOMAH_COUNTDOWN: 'iqomahCountdown', IQOMAH: 'iqomah', SALAT_PREPARE_DURATION: 'salatPrepareDuration', PREPARE_SALAT_SLIDE: 'prepareSalatSlide', PRAYER_TIME: 'prayerTime', SALAT: 'salat', KHUTBAH: 'khutbah', SYURUK_COUNTDOWN: 'syurukCountDown', SYURUK_MAIN: 'syurukMain', SYURUK_END: 'syurukEnd' };

export const waqto = { SUBUH: 'SUBUH', SYURUK: 'SYURUK', ZOHOR: 'ZOHOR', ASAR: 'ASAR', MAGHRIB: 'MAGHRIB', ISYAK: 'ISYAK' };

export const socketAction = { CONTENT: 'content', CREATE_ORG: 'create_org', UPDATE_ORG: 'update_org', DELETE_ORG: 'delete_org', CREATE_USER: 'create_user', DELETE_USER: 'delete_user', UPDATE_USER: 'update_user', TOTAL_CONNECTED_USER: 'totalConnectedUser' };
