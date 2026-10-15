import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from '@/app/store';
import { router } from '@/routes';
import AuthInitializer from '@/components/AuthInitializer';
import Toastify from '@/components/ui/Toastify';
import '@/styles/global.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
      <Toastify />
    </Provider>
  </StrictMode>,
);