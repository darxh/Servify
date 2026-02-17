import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './router.jsx';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast"; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: false,
    },
  },
});
 
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
 
if (!googleClientId) {
  console.error("Google Client ID is missing in .env file!");
}

createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '10px',
                fontWeight: 'bold',
              },
            }} 
          />
          
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);