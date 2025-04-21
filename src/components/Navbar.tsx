import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC<{ isLoggedIn: boolean; onLogout: () => void }> = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 shadow-lg px-6 py-3 flex justify-between items-center sticky top-0 z-50 border-b-4 border-indigo-200 dark:bg-gray-900 dark:border-gray-700 transition-colors duration-500">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md hover:scale-105 transition-transform">GabBlog</Link>
        <Link to="/posts" className="text-white/80 hover:text-yellow-300 font-semibold px-3 py-1 rounded transition-colors duration-200">Blogs</Link>
        <Link to="/tags" className="text-white/80 hover:text-yellow-300 font-semibold px-3 py-1 rounded transition-colors duration-200">Tags</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/posts/manage" className="bg-white/20 hover:bg-white/40 text-white font-bold px-4 py-2 rounded-lg shadow-inner transition">Manage Posts</Link>
        {!isLoggedIn ? (
          <>
            <button onClick={() => navigate('/login')} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-lg shadow transition">Login</button>
            <button onClick={() => navigate('/register')} className="bg-white/20 border border-yellow-300 text-yellow-200 hover:bg-yellow-100 hover:text-yellow-700 px-4 py-2 rounded-lg transition">Register</button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-blue-400 shadow-inner flex items-center justify-center text-white font-bold text-lg">
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-6 h-6'><path d='M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z' /></svg>
            </span>
            <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
