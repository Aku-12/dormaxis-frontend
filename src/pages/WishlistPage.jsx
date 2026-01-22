import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header, Footer, Loading } from '../components/common';
import { useToast } from '../components/common/Toast';
import useDormStore from '../store/useDormStore';
import useAuthStore from '../store/useAuthStore';
import { wishlistAPI } from '../api';
import { API_CONFIG } from '../config/api.config';

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const backendBaseUrl = API_CONFIG.BASE_URL.replace('/api', '');
  return `${backendBaseUrl}${imagePath}`;
};

// Icons
const HeartIcon = ({ filled = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill={filled ? "currentColor" : "none"}
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
);

const BedIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
    <path d="M2 17h20"/>
    <path d="M6 8v9"/>
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

const EmptyWishlistIcon = () => (
  <svg className="w-24 h-24 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
  </svg>
);

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { toggleWishlist } = useDormStore();
  const toast = useToast();

  const [wishlistDorms, setWishlistDorms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/wishlist' } });
    }
  }, [isAuthenticated, navigate]);

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const response = await wishlistAPI.getWishlist();
        if (response.success) {
          setWishlistDorms(response.data);
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load your wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  const handleRemoveFromWishlist = async (dormId, dormName) => {
    try {
      const success = await toggleWishlist(dormId);
      if (success) {
        setWishlistDorms(prev => prev.filter(dorm => dorm._id !== dormId));
        toast.success(`${dormName} removed from wishlist`);
      }
    } catch (err) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP').format(price);
  };

  const getBedsLabel = (beds) => {
    if (beds === 1) return '1 Bed';
    return `${beds} Beds`;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link to="/" className="text-slate-500 hover:text-[#4A90B8]">Home</Link>
            <span className="text-slate-400">/</span>
            <span className="text-[#4A90B8] font-medium">Wishlist</span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#4A90B8]/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#4A90B8]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">My Wishlist</h1>
              <p className="text-slate-500">
                {wishlistDorms.length} {wishlistDorms.length === 1 ? 'dorm' : 'dorms'} saved
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loading />
            <p className="text-slate-500 mt-4">Loading your wishlist...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : wishlistDorms.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <EmptyWishlistIcon />
            <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-2">Your wishlist is empty</h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Start exploring dorms and save your favorites by clicking the heart icon on any dorm you like.
            </p>
            <button
              onClick={() => navigate('/dorms')}
              className="px-6 py-3 bg-[#4A90B8] text-white rounded-lg font-medium hover:bg-[#3A7A9A] transition-colors"
            >
              Explore Dorms
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistDorms.map((dorm) => (
              <div
                key={dorm._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(dorm.image || dorm.images?.[0])}
                    alt={dorm.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => navigate(`/dorms/${dorm._id}`)}
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {dorm.isFeatured && (
                      <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                        Featured
                      </span>
                    )}
                    {dorm.isPopular && (
                      <span className="bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                        Popular
                      </span>
                    )}
                    {dorm.isVerified && (
                      <span className="bg-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(dorm._id, dorm.name)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
                    title="Remove from wishlist"
                  >
                    <HeartIcon filled />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-2 truncate cursor-pointer hover:text-[#4A90B8] transition-colors"
                    onClick={() => navigate(`/dorms/${dorm._id}`)}
                  >
                    {dorm.name}
                  </h3>

                  {/* Info Row */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <BedIcon />
                      {getBedsLabel(dorm.beds)}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span>Block {dorm.block}</span>
                    {dorm.rating > 0 && (
                      <>
                        <span className="text-gray-400">|</span>
                        <span className="flex items-center gap-1">
                          <StarIcon />
                          {dorm.rating.toFixed(1)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Amenities */}
                  {dorm.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {dorm.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {dorm.amenities.length > 3 && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          +{dorm.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-xl font-bold text-[#4A90B8]">
                        Rs {formatPrice(dorm.price)}
                      </span>
                      <span className="text-sm text-gray-500">/month</span>
                    </div>
                    <button
                      onClick={() => navigate(`/dorms/${dorm._id}`)}
                      className="px-4 py-2 text-sm font-medium text-[#4A90B8] border border-[#4A90B8] rounded-lg hover:bg-[#4A90B8] hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
