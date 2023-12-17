import AsyncStorage from '@react-native-async-storage/async-storage';

/*= ============================================================================================
                              masjid key fnc start
= ============================================================================================ */
/**
 * @param {string} value
 * @description just set this value in asyncStorage
 */
export const setAsync = async (value) => {
  try {
    await AsyncStorage.setItem('@masjid', value);
  } catch (e) {
    // console.log('print from asyncStorage operation file setAsync : ', e);
  }
};

/**
 * @description get @masjid key value from asyncStorage
 */
export const getAsync = async () => {
  try {
    return await AsyncStorage.getItem('@masjid');
  } catch (error) {
    // console.log(error);
  }
};

/**
 * @description delete @masjid key value from asyncStorage
 */
export const deleteAsync = async () => {
  try {
    await AsyncStorage.removeItem('@masjid');
  } catch (error) {
    // console.log('print from asyncStorage operation file deleteAsync: ', error);
  }
};

/*= ============================================================================================
                              masjid key fnc end
= ============================================================================================ */

/**
 * @param {string} key
 * @param {string} value
 * @description just set this token value in asyncStorage
 */
export const setAsyncData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // console.log('print from asyncStorage operation file setAsync : ', e);
  }
};

/**
 * @param {string} value
 * @description just get this token value in asyncStorage
 */
export const getAsyncData = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    // console.log('print from asyncStorage operation file setAsync : ', e);
  }
};

/**
 * @param {string} key
 * @param {string} value
 * @description just remove this token value in asyncStorage
 */
export const removeAsyncData = async () => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // console.log('print from asyncStorage operation file setAsync : ', e);
  }
};
