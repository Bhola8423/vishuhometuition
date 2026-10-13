import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Layout components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import FloatingActions from './components/common/FloatingActions';
import StatusCheckModal from './components/common/StatusCheckModal';

// Pages
import HomePage from './pages/HomePage';
import GorakhpurPage from './pages/GorakhpurPage';
import StudentRegistrationPage from './pages/StudentRegistrationPage';
import TutorRegistrationPage from './pages/TutorRegistrationPage';
import QuickEnquiryPage from './pages/QuickEnquiryPage';
import VerificationPage from './pages/VerificationPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStandaloneRoute =
    isAdminRoute ||
    location.pathname === '/tutor-registration' ||
    location.pathname === '/teacher-registration';

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      
      {/* Shared Header - Hidden on Admin & Standalone Registration routes */}
      {!isStandaloneRoute && <Header onOpenStatusModal={() => setIsStatusModalOpen(true)} />}

      {/* Main Content Router View */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage onOpenStatusModal={() => setIsStatusModalOpen(true)} />} />
          <Route path="/home-tuition-gorakhpur" element={<GorakhpurPage />} />
          <Route path="/student-registration" element={<StudentRegistrationPage onOpenStatusModal={() => setIsStatusModalOpen(true)} />} />
          <Route path="/tutor-registration" element={<TutorRegistrationPage onOpenStatusModal={() => setIsStatusModalOpen(true)} />} />
          <Route path="/teacher-registration" element={<TutorRegistrationPage onOpenStatusModal={() => setIsStatusModalOpen(true)} />} />
          <Route path="/quick-enquiry" element={<QuickEnquiryPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/verify-status" element={<VerificationPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Shared Footer & Floating Action Buttons - Hidden on Admin & Standalone Registration routes */}
      {!isStandaloneRoute && <Footer />}
      {!isStandaloneRoute && <FloatingActions />}

      {/* Status Lookup Modal */}
      <StatusCheckModal 
        isOpen={isStatusModalOpen} 
        onClose={() => setIsStatusModalOpen(false)} 
      />
    </div>
  );
}
