import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";

import HomePage from "./pages/HomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import NewAppointmentPage from "./pages/NewAppointmentPage.jsx";
import OAuth2Success from "./pages/OAuth2Success.jsx";

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  useGoogleAnalytics();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <DashboardPage /> : <HomePage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/appointments/:id/chat" element={<ChatPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/appointments/new" element={<NewAppointmentPage />} />
      <Route path="/auth/oauth2/success" element={<OAuth2Success />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default function App() {
  return (
    <>
      {import.meta.env.MODE === 'production' && (
        <div style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          background: '#4CAF50',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          PROD MODE - {import.meta.env.VITE_API_URL}
        </div>
      )}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}
