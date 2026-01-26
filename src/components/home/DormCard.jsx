import React from 'react';
import { useNavigate } from 'react-router-dom';
import useDormStore from '../../store/useDormStore';
import useAuthStore from '../../store/useAuthStore';
import { useToast } from '../common/Toast';
import { API_CONFIG } from '../../config/api.config';

const DormCard = ({ dorm }) => {
  const navigate = useNavigate();
  const { toggleWishlist, wishlist } = useDormStore();
  const { isAuthenticated } = useAuthStore();
  const toast = useToast();

  const isInWishlist = wishlist && wishlist.includes(dorm._id);

  const getDefaultImage = (beds) => {
    if (beds === 1) return 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop';
    if (beds === 2) return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop';
    return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop';
  };

  // Helper to get image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
    return `${baseUrl}${path}`;
  };

  const getDormImage = (dorm) => {
    if (dorm.image) {
      return getImageUrl(dorm.image);
    }
    // Fallback if no images array or main image
    if (dorm.images && dorm.images.length > 0) {
       return getImageUrl(dorm.images[0]);
    }
    return getDefaultImage(dorm.beds);
  };

  const dormImage = getDormImage(dorm);

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const wasInWishlist = isInWishlist;
    const success = await toggleWishlist(dorm._id);
    if (success) {
      if (wasInWishlist) {
        toast.success(`${dorm.name} removed from wishlist`);
      } else {
        toast.success(`${dorm.name} added to wishlist`);
      }
    } else {
      toast.error('Failed to update wishlist');
    }
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    navigate(`/dorms/${dorm._id}`);
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/dorms/${dorm._id}`)}
    >
      <div className="h-40 relative group">
        <img
          src={dormImage}
          alt={dorm.name}
          className="w-full h-full object-cover"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {dorm.isPopular && (
            <span className="bg-[#4A90B8] text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              Popular
            </span>
          )}
        </div>
        {/* Favorite Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
            isInWishlist
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-red-500'
          }`}
        >
          <svg
            className="w-4 h-4"
            fill={isInWishlist ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold mb-2 text-gray-900 truncate">{dorm.name}</h3>
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {dorm.beds} {dorm.beds === 1 ? 'Bed' : 'Beds'}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {dorm.block}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-[#4A90B8]">Rs. {dorm.price.toLocaleString()}</span>
            <span className="text-xs text-gray-500">/mo</span>
          </div>
          <button
            onClick={handleViewClick}
            className="px-4 py-2 bg-[#4A90B8] text-white rounded-lg text-xs font-semibold hover:bg-[#3A7A9A] transition-colors"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default DormCard;
