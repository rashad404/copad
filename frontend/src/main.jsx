import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import AuthProvider from './context/AuthContext.jsx';
import { SiteProvider } from './context/SiteContext.jsx'; // 👈 import here
import './i18n'; // i18n config

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <AuthProvider>
      <SiteProvider>
        <App />
      </SiteProvider>
    </AuthProvider>
  // </React.StrictMode>
);
