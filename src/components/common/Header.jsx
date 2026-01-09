import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
            <a href="#home" className="text-gray-700 hover:text-[#4A90B8] font-bold transition-colors">
              Home
            </a>
          </li>
          <li>
            <a href="#dorms" className="text-gray-700 hover:text-[#4A90B8] font-bold transition-colors">
              Dorms
            </a>
          </li>
          <li>
            <a href="#contact" className="text-gray-700 hover:text-[#4A90B8] font-bold transition-colors">
              Contact Us
            </a>
          </li>
          <li>
            <a href="#about" className="text-gray-700 hover:text-[#4A90B8] font-bold transition-colors">
              About Us
            </a>
          </li>
        </ul>

        {/* User Actions */}
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              {user && (
                <span className="text-gray-700 text-sm hidden lg:block">
                  <span className="font-semibold">{user.name}</span>
                </span>
              )}
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 rounded-lg bg-[#4A90B8] text-white hover:bg-[#3A7A9A] font-medium transition-colors"
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
