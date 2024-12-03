import { Fragment, Suspense } from 'react';

import { Toast } from '@ichiba/ichiba-core-ui';
import { ThemeProvider } from '@material-tailwind/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import AppProvider from './providers/app';
import RouterView from './routes';
import { toastRef } from './utils/toasts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <Fragment>
      <Toast ref={toastRef} className="z-[999999]" />
      <Suspense fallback={null}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <HelmetProvider>
              <AppProvider>
                <RouterView />
              </AppProvider>
            </HelmetProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </Suspense>
    </Fragment>
  );
}

export default App;
