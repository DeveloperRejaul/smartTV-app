import { createContext, useContext } from 'react';
import useGlobal from '../hook/useGlobal';

const Context = createContext({ socket: () => { } });

export default function ContextProvider({ children }) {
  return (
    <Context.Provider value={useGlobal()}>
      {children }
    </Context.Provider>
  );
}

export const useAppContext = () => useContext(Context);
