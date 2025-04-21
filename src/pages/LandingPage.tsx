import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-x-hidden">
      {/* Hero Illustration */}
      <div className="absolute left-0 top-0 w-full h-full pointer-events-none select-none z-0">
        <svg viewBox="0 0 1440 320" className="w-full h-60 opacity-60">
          <path fill="#6366f1" fillOpacity="0.2" d="M0,192L80,202.7C160,213,320,235,480,229.3C640,224,800,192,960,192C1120,192,1280,224,1360,240L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
        </svg>
      </div>
      <div className="relative z-10 text-center px-8 py-14 rounded-3xl shadow-2xl bg-white/80 max-w-2xl mt-10 animate-fadeIn">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 mb-4 drop-shadow-lg">Welcome to Gab Blog!</h1>
        <p className="text-xl text-gray-700 mb-10">Discover insightful articles, share your thoughts, and connect with a vibrant community.<br/>Start your journey by exploring the latest posts or browsing tags.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-4">
          <button onClick={() => navigate('/posts')} className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-bold px-8 py-4 rounded-2xl shadow-xl text-xl transition-all duration-200 transform hover:scale-105">
            <span className="material-icons">explore</span> Explore Blogs
          </button>
          <button onClick={() => navigate('/tags')} className="flex items-center justify-center gap-2 bg-white border-2 border-blue-500 text-blue-700 font-bold px-8 py-4 rounded-2xl shadow-xl text-xl hover:bg-blue-50 transition-all duration-200">
            <span className="material-icons">local_offer</span> Browse Tags
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/register')} className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-400 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl text-xl hover:from-pink-500 hover:to-purple-700 transition-all duration-200">
            <span className="material-icons">person_add</span> Join Now
          </button>
          <button onClick={() => navigate('/login')} className="flex items-center justify-center gap-2 bg-white border-2 border-purple-500 text-purple-700 font-bold px-8 py-4 rounded-2xl shadow-xl text-xl hover:bg-purple-50 transition-all duration-200">
            <span className="material-icons">login</span> Login
          </button>
        </div>
      </div>
      <footer className="relative z-10 mt-16 text-gray-500 text-sm font-semibold tracking-wide drop-shadow-lg">&copy; {new Date().getFullYear()} My Blog. All rights reserved.</footer>
    </div>
  );
};

export default LandingPage;
