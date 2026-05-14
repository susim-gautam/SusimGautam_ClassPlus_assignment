import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfileSetup from './pages/ProfileSetup';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/" element={user ? <HomeOrSetup /> : <Navigate to="/login" />} />
    </Routes>
  );
};

const HomeOrSetup: React.FC = () => {
  const { user } = useAuth();
  const [needsSetup, setNeedsSetup] = React.useState(!user?.profilePic);

  if (needsSetup) {
    return <ProfileSetup onComplete={() => setNeedsSetup(false)} />;
  }

  return <HomePage />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
