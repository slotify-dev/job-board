import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { AppRoutes } from './AppRoutes';
import { store } from './shared/store/store';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  auth0Config,
  onRedirectCallback,
} from './modules/auth/services/auth0Config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function App(): JSX.Element {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Auth0Provider {...auth0Config} onRedirectCallback={onRedirectCallback}>
          <Router>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  color: 'black',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                },
              }}
            />
          </Router>
        </Auth0Provider>
      </QueryClientProvider>
    </Provider>
  );
}
