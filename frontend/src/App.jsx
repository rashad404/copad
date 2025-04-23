import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
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
import OAuthCallbackPage from "./pages/OAuthCallbackPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import ChatLayout from "./layouts/ChatLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import SecurityPage from './pages/SecurityPage';
import ContactPage from "./pages/ContactPage";

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  useGoogleAnalytics();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={isAuthenticated ? <DashboardPage /> : <HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login/callback" element={<OAuthCallbackPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Protected routes - wrapped in MainLayout */}
      {isAuthenticated && (
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointments/new" element={<NewAppointmentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Chat routes with ChatLayout */}
          <Route element={<ChatLayout />}>
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:id" element={<ChatPage />} />
          </Route>
        </Route>
      )}
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default function App() {
  console.log('App component rendered');
  return (
    <BrowserRouter>
      <ChatProvider>
        <AppRoutes />
      </ChatProvider>
    </BrowserRouter>
  );
}
