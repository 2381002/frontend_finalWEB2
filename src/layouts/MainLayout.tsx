import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC<{ isLoggedIn: boolean; onLogout: () => void; children?: React.ReactNode }> = ({ isLoggedIn, onLogout, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        {children ? children : <Outlet />}
      </main>
    </div>
  );
};

export default MainLayout;
