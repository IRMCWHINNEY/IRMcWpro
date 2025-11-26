import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import { INITIAL_DOCTORS } from './constants';
import { Doctor } from './types';

const AppContent: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [currentUser, setCurrentUser] = useState<Doctor | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current page ID for navbar
  const getCurrentPageId = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/register') return 'register';
    if (path === '/dashboard') return 'dashboard';
    return 'home';
  };

  const handleNavigate = (pageId: string) => {
    if (pageId === 'home') navigate('/');
    else if (pageId === 'register') navigate('/register');
    else if (pageId === 'dashboard') {
        // Mock login for demo purposes - default to first doctor if no one registered recently
        if (!currentUser) setCurrentUser(doctors[0]);
        navigate('/dashboard');
    }
  };

  const handleRegister = (newDoctor: Doctor) => {
    setDoctors([...doctors, newDoctor]);
    setCurrentUser(newDoctor);
    navigate('/dashboard');
  };

  const handleUpdateProfile = (updated: Partial<Doctor>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);
    
    setDoctors(prev => prev.map(d => d.id === currentUser.id ? updatedUser : d));
  };

  const handleBook = (doctor: Doctor) => {
    // In a real app, this would open a booking flow
    alert(`Booking flow for ${doctor.name} would open here. Calendar sync status: ${doctor.calendarSynced ? 'Active' : 'Inactive'}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <Navigation 
        currentPage={getCurrentPageId()} 
        onNavigate={handleNavigate} 
      />
      
      <Routes>
        <Route path="/" element={<Home doctors={doctors} onBook={handleBook} />} />
        <Route path="/register" element={<Registration onRegister={handleRegister} />} />
        <Route path="/dashboard" element={
          currentUser ? (
            <Dashboard doctor={currentUser} onUpdateProfile={handleUpdateProfile} />
          ) : (
             <div className="p-10 text-center text-slate-500">Please register or select a demo user.</div>
          )
        } />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
