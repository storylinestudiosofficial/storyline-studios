import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';  // ✅ CRITICAL: Ito ang maglo-load ng kulay/design!
import Home from './pages/Home';
import BookingFlow from './pages/BookingFlow';
import ClientPortal from './pages/ClientPortal';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import Admin from "./pages/Admin";

// Tool ito para bumalik sa taas ang page kapag lumilipat ng view
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Dito nakalagay ang mga "Daanan" o Routes ng site mo
function AppContent() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-deep-black text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookingFlow />} />
          <Route path="/portal" element={<ClientPortal />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

// Ito ang Main entry point ng app mo
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
