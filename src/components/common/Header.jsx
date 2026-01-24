import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { API_CONFIG } from '../../config/api.config';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Get avatar URL with backend base
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
    return `${baseUrl}${avatarPath}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-[#4A90B8] rounded-lg flex items-center justify-center text-white text-xl">
            🏠
          </div>
          <span className="text-2xl font-bold text-gray-900">Dorm Axis</span>
        </div>

        {/* Navigation */}
        <ul className="hidden md:flex gap-8 items-center">
          <li>
            <Link 
              to="/" 
              className={`font-bold transition-colors ${
                isActive('/') ? 'text-[#4A90B8]' : 'text-gray-700 hover:text-[#4A90B8]'
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/dorms" 
              className={`font-bold transition-colors ${
                isActive('/dorms') ? 'text-[#4A90B8]' : 'text-gray-700 hover:text-[#4A90B8]'
              }`}
            >
              Dorms
            </Link>
          </li>
          <li>
            <a href="#contact" className="text-gray-700 hover:text-[#4A90B8] font-bold transition-colors">
              Contact Us
            </a>
          </li>
          <li>
            <Link
              to="/about"
              className={`font-bold transition-colors ${
                isActive('/about') ? 'text-[#4A90B8]' : 'text-gray-700 hover:text-[#4A90B8]'
              }`}
            >
              About Us
            </Link>
          </li>
        </ul>

        {/* User Actions */}
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              {/* Wishlist Icon */}
              <button 
                onClick={() => navigate('/wishlist')}
                className="p-2 text-gray-600 hover:text-[#4A90B8] transition-colors"
                title="Wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Notification Bell */}
              <button 
                className="p-2 text-gray-600 hover:text-[#4A90B8] transition-colors relative"
                title="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* User Avatar/Name */}
              {user && (
                <div
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate('/profile')}
                  title="View Profile"
                >
                  <div className="w-9 h-9 rounded-full bg-[#4A90B8] flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={getAvatarUrl(user.avatar)}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-gray-700 text-sm hidden lg:block font-medium">
                    {user.name}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 rounded-lg border border-[#4A90B8] text-[#4A90B8] hover:bg-[#E8F3F8] font-medium transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2.5 rounded-lg bg-[#4A90B8] text-white hover:bg-[#3A7A9A] font-medium transition-colors"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
