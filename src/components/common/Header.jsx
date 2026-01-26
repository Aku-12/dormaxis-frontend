import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { API_CONFIG } from '../../config/api.config';
import { HeartIcon, LogoutIcon, BuildingIcon, UserIcon, ChevronDownIcon } from './Icons';
import NotificationDropdown from './NotificationDropdown';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get avatar URL with backend base
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
    return `${baseUrl}${avatarPath}`;
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-primary rounded-lg border-2 border-primary flex items-center justify-center">
            <BuildingIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">Dorm Axis</span>
        </div>

        {/* Navigation */}
        <ul className="hidden md:flex gap-8 items-center">
          <li>
            <Link
              to="/"
              className={`font-bold transition-colors ${
                isActive('/') ? 'text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/dorms"
              className={`font-bold transition-colors ${
                isActive('/dorms') ? 'text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              Dorms
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`font-bold transition-colors ${
                isActive('/about') ? 'text-primary' : 'text-gray-700 hover:text-primary'
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
                className="p-2 text-gray-600 hover:text-primary transition-colors"
                title="Wishlist"
              >
                <HeartIcon className="w-6 h-6" />
              </button>

              {/* Notification Dropdown */}
              <NotificationDropdown />

              {/* Profile Dropdown */}
              {user && (
                <div className="relative" ref={dropdownRef}>
                  {/* Avatar Trigger - Only show avatar, no name */}
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm overflow-hidden ring-2 ring-transparent hover:ring-primary/30 transition-all">
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
                    <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg overflow-hidden ring-2 ring-white shadow-sm">
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
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-semibold truncate">{user.name}</p>
                            <p className="text-gray-500 text-sm truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Options */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate('/profile');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                        >
                          <UserIcon className="w-5 h-5 text-gray-400" />
                          <span className="font-medium">My Profile</span>
                        </button>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogoutIcon className="w-5 h-5" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 rounded-lg border border-primary text-primary hover:bg-bg-light font-medium transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-dark font-medium transition-colors"
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

