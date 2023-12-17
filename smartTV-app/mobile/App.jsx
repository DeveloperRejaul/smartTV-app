import 'react-native-gesture-handler';
import { NativeBaseProvider, StatusBar } from 'native-base';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import React from 'react';
import { store, persister } from './src/rtk/app/store';
import { ContextProvider } from './src/context/masjidContext';
import MainNavigation from './src/navigation/MainNavigation';

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar hidden />
      <PersistGate persistor={persister}>
        <ContextProvider>
          <NativeBaseProvider>
            <MainNavigation />
          </NativeBaseProvider>
        </ContextProvider>
      </PersistGate>
    </Provider>
  );
}
