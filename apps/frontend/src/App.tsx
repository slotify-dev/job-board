import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { AppRoutes } from './AppRoutes';
import { store } from './shared/store/store';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export function App(): JSX.Element {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={googleClientId}>
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
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}
