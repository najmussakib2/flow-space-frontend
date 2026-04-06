'use client';

import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { store } from '../../redux/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#0D1117',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#F1F5F9',
          },
        }}
      />
    </Provider>
  );
}