import React, { createContext, useContext } from 'react';
import { useFonts } from 'expo-font';
import { useGlobal } from '../hook/useGlobal';
import Poppins from '../assists/fonts/Poppins-Medium.ttf';
import LibreBaskerville from '../assists/fonts/LibreBaskerville-Regular.ttf';
import Metrophobic from '../assists/fonts/Metrophobic-Regular.ttf';
import Oswald from '../assists/fonts/Oswald-Regular.ttf';
import FjallaOne from '../assists/fonts/FjallaOne-Regular.ttf';
import Raleway from '../assists/fonts/Raleway-SemiBold.ttf';
import Kalam from '../assists/fonts/Kalam-Regular.ttf';
import Electrolize from '../assists/fonts/Electrolize-Regular.ttf';
import Audiowide from '../assists/fonts/Audiowide-Regular.ttf';
import AdventPro from '../assists/fonts/AdventPro.ttf';

const Context = createContext();

export function ContextProvider({ children }) {
  const [isLoaded] = useFonts({
    'Poppins-Medium': Poppins,
    'LibreBaskerville-Regular': LibreBaskerville,
    'Metrophobic-Regular': Metrophobic,
    'Oswald-VariableFont': Oswald,
    'FjallaOne-Regular': FjallaOne,
    'Raleway-Regular': Raleway,
    'Kalam-Regular': Kalam,
    'Electrolize-Regular': Electrolize,
    'Audiowide-Regular': Audiowide,
    'AdventPro-Regular': AdventPro,
  });
  const jsx = isLoaded ? children : null;

  return (
    <Context.Provider value={{ ...useGlobal() }}>
      {jsx}
    </Context.Provider>
  );
}
export const useAppContext = () => useContext(Context);
