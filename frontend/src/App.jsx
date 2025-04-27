import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AdminLayout from "./layouts/AdminLayout.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import SecurityPage from './pages/SecurityPage';
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage.jsx";
import BlogPostPage from "./pages/BlogPostPage.jsx";
import BlogSearchPage from "./pages/BlogSearchPage.jsx";
import BlogTagPage from "./pages/BlogTagPage.jsx";
import BlogFormPage from "./pages/BlogFormPage.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminPostList from "./pages/admin/AdminPostList.jsx";
import AdminPostForm from "./pages/admin/AdminPostForm.jsx";
import AdminTagManagement from "./pages/admin/AdminTagManagement.jsx";

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  useGoogleAnalytics();
  
  return (
    <Routes>
    {/* Public Pages wrapped in MainLayout */}
    <Route element={<MainLayout />}>
    <Route 
      path="/" 
      element={isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage />} 
    />

      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/tag/:tagSlug" element={<BlogTagPage />} />
      <Route path="/blog/search" element={<BlogSearchPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />

      {/* Authentication pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    {/* OAuth callback */}
    <Route path="/login/callback" element={<OAuthCallbackPage />} />

    {/* Protected Routes */}
    <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/appointments/new" element={<NewAppointmentPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/chat" element={<ChatLayout><ChatPage /></ChatLayout>} />
      <Route path="/chat/:id" element={<ChatLayout><ChatPage /></ChatLayout>} />
    </Route>

    {/* Admin Routes */}
    <Route path="/admin" element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />}>
      <Route index element={<AdminDashboard />} />
      <Route path="posts" element={<AdminPostList />} />
      <Route path="posts/create" element={<AdminPostForm />} />
      <Route path="posts/edit/:id" element={<AdminPostForm />} />
      <Route path="tags" element={<AdminTagManagement />} />
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>

  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <AppRoutes />
      </ChatProvider>
    </BrowserRouter>
  );
}