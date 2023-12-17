import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import clockReducer from '../features/clock/clockSlice';
import contentReducer from '../features/content/contentSlice';
import { masjidApi } from '../features/api/api';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import navigationReducer from '../features/navigation/navigationSlice';
import { fileMiddleware } from '../middleware/fileMiddleware';
import screenReducer from '../features/screen/screenSlice';
import themeReducer from '../features/theme/themeSlice';

// config persist
const persistConfig = {
  key: '@root',
  storage: AsyncStorage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);


// store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: userReducer,
    clock: clockReducer,
    content: contentReducer,
    navigation: navigationReducer,
    screen: screenReducer,
    theme: themeReducer,
    [masjidApi.reducerPath]: masjidApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      warnAfter: 1000,
    },
    immutableCheck: { warnAfter: 1000 },
  }).concat(masjidApi.middleware).concat(fileMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persister = persistStore(store);
