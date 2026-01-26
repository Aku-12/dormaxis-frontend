import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header, Footer, Loading, useToast } from '../components/common';
import useDormStore from '../store/useDormStore';
import useAuthStore from '../store/useAuthStore';
import { reviewsAPI } from '../api';

// Amenity icons mapping
const amenityIcons = {
  'WiFi': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Air Conditioning': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 16a4 4 0 1 0 8 0M12 4v4M12 8c-2 0-3 1-3 3M12 8c2 0 3 1 3 3M6 12h12M9 20l3-4 3 4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Parking': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Laundry': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <circle cx="12" cy="12" r="4"/>
      <path d="M6 8h.01M9 8h.01" strokeLinecap="round"/>
    </svg>
  ),
  'Furnished': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3M4 11v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M4 11h16" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 18v2M16 18v2" strokeLinecap="round"/>
    </svg>
  ),
  'Kitchen': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15v-2a4 4 0 0 0-4-4h-1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 15l-3-3m0 6l3-3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'TV': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M17 2l-5 5-5-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Smart TV': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M17 2l-5 5-5-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Gym': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6.5 6.5L17.5 17.5M6.5 17.5L17.5 6.5" strokeLinecap="round"/>
      <path d="M2 12h4M18 12h4M6 6v12M18 6v12" strokeLinecap="round"/>
    </svg>
  ),
  'Heating': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a5 5 0 0 0-5 5c0 3 5 10 5 10s5-7 5-10a5 5 0 0 0-5-5z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="1"/>
    </svg>
  ),
  'In-unit Washer': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <circle cx="12" cy="12" r="4"/>
      <path d="M6 8h.01M9 8h.01" strokeLinecap="round"/>
    </svg>
  ),
};

// Helper function to get amenity label
const getAmenityLabel = (amenity) => {
  const labels = {
    'WiFi': 'High-Speed WiFi',
    'Air Conditioning': 'Air Conditioning',
    'Parking': 'Parking',
    'Laundry': 'Laundry',
    'Furnished': 'Fully Furnished',
    'Kitchen': 'Kitchen Access',
    'TV': 'Smart TV',
    'Gym': 'Gym Access',
    'Heating': 'Heating',
    'Smart TV': 'Smart TV',
    'In-unit Washer': 'In-unit Washer',
  };
  return labels[amenity] || amenity;
};

// Star rating component
const StarRating = ({ rating, size = 16 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24">
          <defs>
            <linearGradient id={`half-${i}`}>
              <stop offset="50%" stopColor="#fbbf24"/>
              <stop offset="50%" stopColor="#e2e8f0"/>
            </linearGradient>
          </defs>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={`url(#half-${i})`}/>
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#e2e8f0" stroke="#e2e8f0">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      );
    }
  }
  
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

import { API_CONFIG } from '../config/api.config';

// ... (StarRating component remains same)

const DormDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentDorm, loading, error, fetchDormById, clearCurrentDorm, toggleWishlist, wishlist } = useDormStore();
  const { isAuthenticated } = useAuthStore();
  const toast = useToast();

  // Helper to get image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
    return `${baseUrl}${path}`;
  };
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showAllDescription, setShowAllDescription] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [moveInDate, setMoveInDate] = useState('');
  const [priceOption, setPriceOption] = useState('monthly');
  const [guests, setGuests] = useState(1);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  
  const isInWishlist = wishlist.includes(id);
  
  useEffect(() => {
    fetchDormById(id);
    fetchReviews();
    
    return () => {
      clearCurrentDorm();
    };
  }, [id]);
  
  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await reviewsAPI.getReviewsByDormId(id, 1, 5);
      if (response.success) {
        setReviews(response.data);
        setReviewStats(response.stats);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };
  
  const handleWishlistClick = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const wasInWishlist = isInWishlist;
    const success = await toggleWishlist(id);
    if (success && currentDorm) {
      if (wasInWishlist) {
        toast.success(`${currentDorm.name} removed from wishlist`);
      } else {
        toast.success(`${currentDorm.name} added to wishlist`);
      }
    } else if (!success) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleReserveNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${id}` } });
      return;
    }
    navigate(`/booking/${id}`);
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP').format(price);
  };
  
  const getBedsLabel = (beds) => {
    if (beds === 1) return '1 Bed';
    return `${beds} Beds`;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Calculate prices
  const securityDeposit = currentDorm ? Math.round(currentDorm.price * 0.08) : 0;
  const totalPrice = currentDorm ? currentDorm.price + securityDeposit : 0;
  
  // Get images array with processed URLs
  const getImages = () => {
    if (!currentDorm) return [];
    
    // Combine main image and images array
    let allImages = [];
    if (currentDorm.image) {
      allImages.push(currentDorm.image);
    }
    if (currentDorm.images && currentDorm.images.length > 0) {
      allImages = [...allImages, ...currentDorm.images];
    }
    
    // Remove duplicates
    allImages = [...new Set(allImages)];
    
    // Default image if empty
    if (allImages.length === 0) {
      return ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop'];
    }
    
    // Process URLs
    return allImages.map(img => getImageUrl(img));
  };
  
  const images = getImages();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loading />
          <p className="text-slate-500">Loading dorm details...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !currentDorm) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Dorm not found</h2>
            <p className="text-slate-500 mb-6">{error || 'The dorm you are looking for does not exist.'}</p>
            <button 
              className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-light transition-colors"
              onClick={() => navigate('/dorms')}
            >
              Back to Dorms
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-slate-500 hover:text-[#1e3a5f]">Home</Link>
          <span className="text-slate-400">›</span>
          <Link to="/dorms" className="text-slate-500 hover:text-[#1e3a5f]">Dorms</Link>
          <span className="text-slate-400">›</span>
          <span className="text-secondary font-medium">{currentDorm.name}</span>
        </nav>
        
        {/* Image Carousel */}
        <div className="mb-8 rounded-2xl overflow-hidden bg-slate-900">
          {/* Main Carousel */}
          <div className="relative">
            {/* Main Image */}
            <div
              className="aspect-[16/9] md:aspect-[21/9] cursor-pointer overflow-hidden"
              onClick={() => setSelectedImageIndex(currentCarouselIndex)}
            >
              <img
                src={images[currentCarouselIndex]}
                alt={`${currentDorm.name} - ${currentCarouselIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-lg font-medium">
              {currentCarouselIndex + 1} / {images.length}
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentCarouselIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                >
                  <svg className="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentCarouselIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                >
                  <svg className="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 p-3 bg-slate-100 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCarouselIndex(index)}
                  className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all duration-200 ${
                    currentCarouselIndex === index
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Verified Badge */}
            {currentDorm.isVerified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Verified
              </span>
            )}
            
            {/* Dorm Header */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">{currentDorm.name}</h1>
              <div className="flex items-center gap-4 flex-wrap text-slate-500">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  {getBedsLabel(currentDorm.beds)}
                </span>
                <span>Block {currentDorm.block}</span>
                <span className="flex items-center gap-1 text-amber-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fbbf24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span className="font-semibold">{currentDorm.rating?.toFixed(1) || '0.0'}</span>
                </span>
              </div>
            </div>
            
            {/* About Section */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4M12 8h.01"/>
                </svg>
                About this dorm
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {showAllDescription 
                  ? currentDorm.description 
                  : currentDorm.description?.slice(0, 300) + (currentDorm.description?.length > 300 ? '...' : '')
                }
              </p>
              {currentDorm.description?.length > 300 && (
                <button 
                  className="text-blue-500 font-medium mt-3 hover:underline"
                  onClick={() => setShowAllDescription(!showAllDescription)}
                >
                  {showAllDescription ? 'Show less' : 'Read more'}
                </button>
              )}
            </section>
            
            {/* Amenities Section */}
            {currentDorm.amenities?.length > 0 && (
              <section className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                  <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  What this place offers
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {currentDorm.amenities.map((amenity) => (
                    <div 
                      key={amenity} 
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg text-slate-700"
                    >
                      <span className="text-slate-500">
                        {amenityIcons[amenity] || (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M8 12l2 2 4-4"/>
                          </svg>
                        )}
                      </span>
                      <span className="text-sm font-medium">{getAmenityLabel(amenity)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Reviews Section */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Reviews</h2>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="text-4xl font-bold text-slate-800">
                  {reviewStats?.averageRating?.toFixed(1) || currentDorm.rating?.toFixed(1) || '0.0'}
                </div>
                <div>
                  <StarRating rating={reviewStats?.averageRating || currentDorm.rating || 0} />
                  <div className="text-sm text-slate-500 mt-1">
                    {reviewStats?.totalReviews || currentDorm.totalReviews || 0} reviews
                  </div>
                </div>
              </div>
              
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <Loading />
                </div>
              ) : reviews.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="flex items-start gap-3 mb-3">
                          {review.userAvatar ? (
                            <img 
                              src={review.userAvatar} 
                              alt={review.userName} 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-semibold">
                              {review.userName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-slate-800">{review.userName}</div>
                            <div className="text-xs text-slate-500">{formatDate(review.createdAt)}</div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className="w-3.5 h-3.5"
                                viewBox="0 0 24 24" 
                                fill={i < review.rating ? '#fbbf24' : '#e2e8f0'}
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                  
                  {(reviewStats?.totalReviews || currentDorm.totalReviews || 0) > 5 && (
                    <button className="w-full mt-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                      Show all {reviewStats?.totalReviews || currentDorm.totalReviews} reviews
                    </button>
                  )}
                </>
              ) : (
                <p className="text-slate-500 text-center py-8">
                  No reviews yet. Be the first to review this dorm!
                </p>
              )}
            </section>
          </div>
          
          {/* Booking Sidebar */}
          <aside className="lg:sticky lg:top-4 h-fit">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-slate-800">Rs{formatPrice(currentDorm.price)}</span>
                  <span className="text-slate-500">/ month</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fbbf24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span className="font-semibold text-sm">{currentDorm.rating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Move-in Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
                  <select 
                    value={priceOption} 
                    onChange={(e) => setPriceOption(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="monthly">Rs {formatPrice(currentDorm.price)}/ month</option>
                    <option value="quarterly">Rs {formatPrice(currentDorm.price * 3)}/ quarter</option>
                    <option value="yearly">Rs {formatPrice(currentDorm.price * 12)}/ year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Guests</label>
                  <select 
                    value={guests} 
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value={1}>1 Person</option>
                    <option value={2}>2 Persons</option>
                  </select>
                </div>
                
                <div className="h-px bg-slate-200 my-4"></div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Price</span>
                  <span className="text-slate-800 font-medium">Rs {formatPrice(currentDorm.price)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Security deposit</span>
                  <span className="text-slate-800 font-medium">Rs {formatPrice(securityDeposit)}</span>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-slate-200">
                  <span className="font-semibold text-slate-800">Total</span>
                  <span className="font-bold text-primary">Rs {formatPrice(totalPrice)}</span>
                </div>
                
                <button 
                  onClick={handleReserveNow}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Reserve Now
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                
                <p className="text-center text-sm text-slate-500">You won't be charged yet</p>
                
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Free cancellation within 48 hours
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Instant booking confirmation
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      
      <Footer />
      
      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full text-white text-2xl flex items-center justify-center z-10 transition-colors"
              onClick={() => setSelectedImageIndex(null)}
            >
              ×
            </button>
            
            {selectedImageIndex > 0 && (
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
            )}
            
            <img 
              src={images[selectedImageIndex]} 
              alt={`${currentDorm.name} - ${selectedImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {selectedImageIndex < images.length - 1 && (
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DormDetailPage;
