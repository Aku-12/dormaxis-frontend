import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer, Loading, ReviewModal, useToast } from '../components/common';
import { EyeIcon, EyeOffIcon } from '../components/common/Icons';
import useAuthStore from '../store/useAuthStore';
import { authAPI, bookingAPI, reviewAPI } from '../api';
import { API_CONFIG } from '../config/api.config';

// Simple time ago helper to avoid date-fns dependency
const formatDistanceToNow = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  
  return `${Math.floor(diffInMonths / 12)} year${Math.floor(diffInMonths / 12) > 1 ? 's' : ''} ago`;
};

const ActiveSessionsSection = () => {
  const { getSessions, revokeSession, revokeAllSessions, logout } = useAuthStore();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserSessions = async () => {
    setLoading(true);
    const result = await getSessions();
    if (result.success) {
      setSessions(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserSessions();
  }, []);

  const handleRevoke = async (sessionId) => {
    if (window.confirm('Are you sure you want to log out this device?')) {
      const result = await revokeSession(sessionId);
      if (result.success) {
        fetchUserSessions();
      }
    }
  };

  const handleRevokeAll = async () => {
    if (window.confirm('Are you sure you want to sign out from ALL devices? This will also end your current session.')) {
      const result = await revokeAllSessions();
      if (result.success) {
        // Since current session is also revoked, redirect to login
        await logout();
        navigate('/login');
      }
    }
  };

  const handleCurrentLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
        await logout();
        navigate('/login');
    }
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 flex justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2>
        </div>
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={fetchUserSessions}
            className="text-sm font-medium hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2>
        </div>
        {sessions.length > 1 && (
          <button
            onClick={handleRevokeAll}
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            Sign Out from All Devices
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {sessions.length === 0 ? (
             <div className="p-4 text-center text-gray-500">
               No active sessions found.
             </div>
        ) : (
            sessions.map((session) => (
            <div
                key={session._id}
                className={`p-4 border-b border-gray-100 last:border-0 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                session.isCurrent ? 'bg-blue-50/50' : ''
                }`}
            >
                <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    session.isCurrent ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                }`}>
                    {session.deviceType === 'Mobile' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                        {session.os} • {session.browser}
                    </span>
                    {session.isCurrent && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        Current
                        </span>
                    )}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                    {session.ipAddress} • Last active {formatDistanceToNow(new Date(session.lastActivity))}
                    </div>
                </div>
                </div>

                {session.isCurrent ? (
                    <button
                        onClick={handleCurrentLogout}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-white transition-colors"
                        title="Log Out"
                    >
                        Log Out
                    </button>
                ) : (
                    <button
                        onClick={() => handleRevoke(session._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Revoke Session"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>
            ))
        )}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // Booking State
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedDormForReview, setSelectedDormForReview] = useState(null);

  // Change Password Modal State
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Password Visibility State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Delete Account Modal State
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Form state for personal info
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: user?.preferences?.notifications?.email ?? true,
    smsNotifications: user?.preferences?.notifications?.sms ?? false,
    twoFactorAuth: user?.mfaEnabled ?? false,
  });

  // Get avatar URL with backend base
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    // Remove /api from BASE_URL and append avatar path
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
    return `${baseUrl}${avatarPath}`;
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      const response = await bookingAPI.getUserBookings();
      if (response.success) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);


  // Helper to check if review can be added
  const canReview = (booking) => {
    return (booking.status === 'confirmed' || booking.status === 'completed') && !booking.hasReviewed;
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedDormForReview({
        id: booking.dorm._id,
        name: booking.dorm.name
    });
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (reviewData) => {
    if (!selectedDormForReview) return;
    try {
        await reviewAPI.addReview(selectedDormForReview.id, reviewData);
        toast.success('Review submitted successfully!');
        // Refresh bookings or Review state if needed (not strictly necessary if we don't show "Reviewed" badge immediately on refresh)
        fetchBookings(); // Refresh bookings to update 'hasReviewed' status
    } catch (error) {
        throw error; // Re-throw to be handled by the modal
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingToggle = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords match
    if (passwordFormData.newPassword !== passwordFormData.confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    // Validate password length
    if (passwordFormData.newPassword.length < 12) {
      setPasswordError('Password must be at least 12 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await authAPI.changePassword({
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword,
        confirmNewPassword: passwordFormData.confirmNewPassword,
      });

      if (response.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setTimeout(() => {
          setIsChangePasswordModalOpen(false);
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(response.error || 'Failed to change password');
      }
    } catch (error) {
      setPasswordError(error.response?.data?.error || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteAccountError('');
    setDeleteAccountLoading(true);

    try {
      const response = await authAPI.deleteAccount(deleteAccountPassword);
      if (response.success) {
        // Clear auth store and redirect to login
        useAuthStore.getState().logout();
        navigate('/login');
      } else {
        setDeleteAccountError(response.error || 'Failed to delete account');
      }
    } catch (error) {
      setDeleteAccountError(error.response?.data?.error || 'Failed to delete account');
    } finally {
      setDeleteAccountLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });

      if (response.success) {
        updateUser(response.data);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size too large. Maximum size is 5MB.' });
      return;
    }

    setAvatarLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authAPI.uploadAvatar(file);

      if (response.success) {
        updateUser({ avatar: response.data.avatar });
        setMessage({ type: 'success', text: 'Avatar uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to upload avatar' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to upload avatar' });
    } finally {
      setAvatarLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user?.avatar) return;

    setAvatarLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authAPI.deleteAvatar();

      if (response.success) {
        updateUser({ avatar: '' });
        setMessage({ type: 'success', text: 'Avatar deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to delete avatar' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to delete avatar' });
    } finally {
      setAvatarLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'bookings', label: 'My Bookings' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar with upload functionality */}
            <div className="relative group">
              <div
                className={`w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 cursor-pointer ${
                  avatarLoading ? 'opacity-50' : ''
                }`}
                onClick={handleAvatarClick}
              >
                {user?.avatar ? (
                  <img
                    src={getAvatarUrl(user.avatar)}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-3xl font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                {/* Loading spinner */}
                {avatarLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                    <svg className="animate-spin w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Delete avatar button */}
              {user?.avatar && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAvatar();
                  }}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-md"
                  title="Delete avatar"
                  disabled={avatarLoading}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-secondary">{user?.name || 'John Doe'}</h1>
              <p className="text-gray-500 mt-1">{user?.email || 'john.doe@email.com'}</p>

              {/* Stats */}
              <div className="flex justify-center sm:justify-start gap-8 mt-4">
                <div className="text-center">
                  <span className="block text-xl font-bold text-primary">{bookings.length}</span>
                  <span className="text-sm text-gray-500">Bookings</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold text-primary">2</span>
                  <span className="text-sm text-gray-500">Reviews</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => {
                if (isEditing) {
                  // Reset form data when canceling
                  setFormData({
                    firstName: user?.name?.split(' ')[0] || '',
                    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                  });
                }
                setIsEditing(!isEditing);
                setMessage({ type: '', text: '' });
              }}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex gap-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-[#4A90B8] transition-colors"
                      placeholder="john.doe@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading && (
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* My Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-900">My Bookings</h2>
                </div>

                {bookingsLoading ? (
                    <div className="flex justify-center py-12">
                        <Loading />
                    </div>
                ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={booking.dorm?.image ? getAvatarUrl(booking.dorm.image) : '/images/dorms/default.jpg'}
                        alt={booking.dorm?.name}
                        className="w-full sm:w-24 h-32 sm:h-20 object-cover rounded-lg"
                        onError={(e) => { e.target.src = '/images/dorms/default.jpg'; }}
                      />
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start">
                             <h3 className="font-semibold text-gray-900">{booking.dorm?.name || 'Unknown Dorm'}</h3>
                             <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                booking.status === 'confirmed' || booking.status === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : booking.status === 'pending' 
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                            >
                                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                           <span>Block {booking.dorm?.block}</span>
                           <span>•</span>
                           <span>{booking.numberOfOccupants} Guests</span>
                           <span>•</span>
                           <span>Rs {booking.totalAmount?.toLocaleString()}</span>
                        </div>
                        
                         {/* Action Buttons */}
                         <div className="flex gap-3 mt-3">
                            <button 
                                onClick={() => navigate(`/booking/success/${booking._id}`, { state: { booking } })}
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                View Ticket
                            </button>
                            
                            {canReview(booking) && (
                                <button
                                    onClick={() => handleOpenReviewModal(booking)}
                                    className="text-sm font-medium text-primary hover:text-primary-dark hover:underline flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    Write Review
                                </button>
                            )}
                         </div>

                      </div>
                    </div>
                  ))}

                  {bookings.length === 0 && (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="mt-4 text-gray-900 font-medium">No bookings yet</h3>
                      <p className="mt-2 text-gray-500 text-sm">Your booking history will appear here.</p>
                      <button onClick={() => navigate('/dorms')} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
                        Browse Dorms
                      </button>
                    </div>
                  )}
                </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                {/* Notifications Section */}
                {/* Notifications Section Removed */}

                {/* Security Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Change Password</h3>
                        <p className="text-sm text-gray-500">Update your account password</p>
                      </div>
                      <button 
                        onClick={() => setIsChangePasswordModalOpen(true)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white font-medium text-sm transition-colors"
                      >
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user?.mfaEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <svg className={`w-5 h-5 ${user?.mfaEnabled ? 'text-green-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">
                            {user?.mfaEnabled ? (
                              <span className="text-green-600">Enabled - Your account is protected</span>
                            ) : (
                              'Add extra security to your account'
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/mfa-setup')}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white font-medium text-sm transition-colors"
                      >
                        {user?.mfaEnabled ? 'Manage' : 'Enable'}
                      </button>
                    </div>
                  </div>

                  {/* Active Sessions Section */}
                  <ActiveSessionsSection />
                </div>

                {/* Delete Account Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <h2 className="text-lg font-semibold text-red-500">Delete Account</h2>
                  </div>

                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Once you delete your account, there is no going back.
                    </p>
                    <button 
                      onClick={() => setIsDeleteAccountModalOpen(true)}
                      className="px-4 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            onSubmit={handleSubmitReview}
            dormName={selectedDormForReview?.name}
        />

        {/* Change Password Modal */}
        {isChangePasswordModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                  <button
                    onClick={() => {
                      setIsChangePasswordModalOpen(false);
                      setPasswordFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
                      setPasswordError('');
                      setPasswordSuccess('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                    {passwordSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordFormData.currentPassword}
                      onChange={handlePasswordInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-12"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordFormData.newPassword}
                      onChange={handlePasswordInputChange}
                      required
                      minLength={12}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-12"
                      placeholder="Enter new password (min 12 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      name="confirmNewPassword"
                      value={passwordFormData.confirmNewPassword}
                      onChange={handlePasswordInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-12"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmNewPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangePasswordModalOpen(false);
                      setPasswordFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
                      setPasswordError('');
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {passwordLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {isDeleteAccountModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Delete Account</h2>
                  </div>
                  <button
                    onClick={() => {
                      setIsDeleteAccountModalOpen(false);
                      setDeleteAccountPassword('');
                      setDeleteAccountError('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleDeleteAccount} className="p-6 space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600 font-medium mb-2">Warning: This action cannot be undone!</p>
                  <p className="text-sm text-gray-600">
                    Deleting your account will permanently remove all your data, including your profile, bookings, and reviews.
                  </p>
                </div>

                {deleteAccountError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {deleteAccountError}
                  </div>
                )}

                {/* Only show password field for non-Google users */}
                {!user?.googleId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your password to confirm
                    </label>
                    <div className="relative">
                      <input
                        type={showDeletePassword ? "text" : "password"}
                        value={deleteAccountPassword}
                        onChange={(e) => setDeleteAccountPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all pr-12"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowDeletePassword(!showDeletePassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showDeletePassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDeleteAccountModalOpen(false);
                      setDeleteAccountPassword('');
                      setDeleteAccountError('');
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deleteAccountLoading}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {deleteAccountLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Delete My Account'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
