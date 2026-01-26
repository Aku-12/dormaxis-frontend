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

  const isInWishlist = wishlist.includes(dorm._id);

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

  const getBadge = () => {
    if (dorm.isFeatured) return { text: 'Featured', color: 'bg-blue-500' };
    if (dorm.isPopular) return { text: 'Popular', color: 'bg-amber-500' };
    if (dorm.isVerified) return { text: '✓ Verified', color: 'bg-emerald-500' };
    if (dorm.isNew) return { text: 'New', color: 'bg-purple-500' };
    return null;
  };

  const badge = getBadge();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP').format(price);
  };

  const getBedsLabel = (beds) => {
    if (beds === 1) return '1 Bed';
    if (beds === 2) return 'Two Bed';
    return `${beds} Beds`;
  };

  // Convert relative path to full URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
    return `${baseUrl}${path}`;
  };

  // Default image if none provided
  const rawImageUrl = dorm.image || dorm.images?.[0];
  const imageUrl = rawImageUrl
    ? getImageUrl(rawImageUrl)
    : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop';

  const handleCardClick = () => {
    navigate(`/dorms/${dorm._id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={dorm.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {badge && (
            <span className={`${badge.color} text-white text-xs font-medium px-2.5 py-1 rounded-md`}>
              {badge.text}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
            isInWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5"
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

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {dorm.name}
        </h3>
        
        {/* Info Row */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {getBedsLabel(dorm.beds)}
          </span>
          <span className="text-gray-400">|</span>
          <span>{dorm.block}</span>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-bold text-[#4A90B8]">
              Rs {formatPrice(dorm.price)}
            </span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dorms/${dorm._id}`);
            }}
            className="px-4 py-2 text-sm font-medium text-[#4A90B8] border border-[#4A90B8] rounded-lg hover:bg-[#4A90B8] hover:text-white transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default DormCard;
