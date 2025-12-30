import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 1. Import the Provider
import router from './router.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap the Router with AuthProvider */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);