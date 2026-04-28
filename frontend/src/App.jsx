import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import DutyExchangeForm from './components/DutyExchangeForm'
import FilePreviewPage from './components/FilePreviewPage'
import DutyExchangeManagement from './components/DutyExchangeManagement'
import Menubar from './components/Menubar'
import Settings from './components/Settings'
import Profile from './components/Profile'

// Import new Login components
import LoginSelection from './components/Login/LoginSelection'
import RoleLogin from './components/Login/RoleLogin'
import RoleSignUp from './components/Login/RoleSignUp'
import ForgotPassword from './components/Login/ForgotPassword'

// Protected Route Wrapper
const RequireAuth = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect them to the login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Layout component to control Menubar visibility
const AppLayout = ({ children }) => {
  return (
    <div className="app">
      <Menubar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

function App() {
  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Login Routes */}
        <Route path="/login" element={<LoginSelection />} />
        <Route path="/login/:role" element={<RoleLogin />} />
        <Route path="/signup/:role" element={<RoleSignUp />} />
        <Route path="/forgot-password/:role" element={<ForgotPassword />} />

        {/* Protected Application Routes */}
        <Route path="/*" element={
          <RequireAuth>
            <AppLayout>
              <Routes>
                <Route path="/" element={<DutyExchangeManagement />} />
                <Route path="/form" element={<DutyExchangeForm />} />
                <Route path="/preview" element={<FilePreviewPage />} />
                <Route path="/Settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </AppLayout>
          </RequireAuth>
        } />
      </Routes>
    </Router>
  )
}

export default App
