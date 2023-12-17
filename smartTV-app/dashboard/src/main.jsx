import React from 'react';
import './index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-toastify/dist/ReactToastify.css';
import 'react-circular-progressbar/dist/styles.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { store } from './rtk/app/store';
import router from './routes/route';
import ContextProvider from './context/context';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <ToastContainer />
        <RouterProvider router={router} />
      </ContextProvider>
    </Provider>
  </React.StrictMode>,
);
