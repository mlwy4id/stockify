import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/app/index.css';
import App from '@/app/App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalTopLoadingBar } from '@/shared/components';
import { Toast } from '@/shared/components/Toast';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <GlobalTopLoadingBar>
          <App />
          <Toast />
        </GlobalTopLoadingBar>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
