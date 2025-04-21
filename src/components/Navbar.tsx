import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC<{ isLoggedIn: boolean; onLogout: () => void }> = ({ isLoggedIn, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Menu items as a component for reuse
  const MenuItems = () => (
    <>
      <Link to="/posts" className="block md:inline px-4 py-3 md:py-1 text-lg md:text-base text-indigo-900 md:text-white/80 hover:text-yellow-500 font-semibold rounded transition-colors duration-200" onClick={() => setMenuOpen(false)}>Blogs</Link>
      <Link to="/tags" className="block md:inline px-4 py-3 md:py-1 text-lg md:text-base text-indigo-900 md:text-white/80 hover:text-yellow-500 font-semibold rounded transition-colors duration-200" onClick={() => setMenuOpen(false)}>Tags</Link>
      <Link to="/posts/manage" className="block md:inline px-4 py-3 md:py-1 text-lg md:text-base bg-indigo-200/70 md:bg-white/20 hover:bg-indigo-300/80 md:hover:bg-white/40 text-indigo-900 md:text-white font-bold rounded-lg shadow-inner transition w-full md:w-auto" onClick={() => setMenuOpen(false)}>Manage Posts</Link>
      {!isLoggedIn ? (
        <>
          <button onClick={() => { setMenuOpen(false); navigate('/login'); }} className="block md:inline w-full md:w-auto bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-3 md:py-2 rounded-lg shadow transition my-1">Login</button>
          <button onClick={() => { setMenuOpen(false); navigate('/register'); }} className="block md:inline w-full md:w-auto bg-white/20 border border-yellow-300 text-yellow-700 md:text-yellow-200 hover:bg-yellow-100 hover:text-yellow-700 px-4 py-3 md:py-2 rounded-lg transition my-1">Register</button>
        </>
      ) : (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-blue-400 shadow-inner flex items-center justify-center text-white font-bold text-lg">
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-6 h-6'><path d='M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z' /></svg>
          </span>
          <button onClick={() => { setMenuOpen(false); onLogout(); }} className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-3 md:py-2 rounded-lg shadow transition">Logout</button>
        </div>
      )}
    </>
  );

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 shadow-lg px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-50 border-b-4 border-indigo-200 dark:bg-gray-900 dark:border-gray-700 transition-colors duration-500">
      {/* Logo & Hamburger */}
      <div className="flex items-center gap-3 md:gap-6">
        <Link to="/" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md hover:scale-105 transition-transform">GabBlog</Link>
        {/* Hamburger only on mobile */}
        <button className="md:hidden ml-2 focus:outline-none" aria-label="Open menu" onClick={() => setMenuOpen(v => !v)}>
          <span className="block w-8 h-1 bg-white rounded mb-1 transition-transform duration-300" style={{ transform: menuOpen ? 'rotate(45deg) translateY(10px)' : 'none' }}></span>
          <span className={`block w-8 h-1 bg-white rounded mb-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className="block w-8 h-1 bg-white rounded transition-transform duration-300" style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-10px)' : 'none' }}></span>
        </button>
      </div>
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        <MenuItems />
      </div>
      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 animate-fadeIn" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-3/4 max-w-xs h-full bg-white z-50 shadow-xl animate-slideIn flex flex-col gap-2 pt-16 px-6">
            <MenuItems />
          </div>
        </>
      )}
      {/* Animations */}
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slideIn { animation: slideIn 0.25s cubic-bezier(0.4,0,0.2,1) forwards; }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn { animation: fadeIn 0.25s cubic-bezier(0.4,0,0.2,1) forwards; }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
