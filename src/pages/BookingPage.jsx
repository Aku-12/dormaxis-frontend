import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header, Footer, Loading, ErrorMessage } from '../components/common';
import useAuthStore from '../store/useAuthStore';
import { bookingAPI, paymentAPI } from '../api';
import { API_CONFIG } from '../config/api.config';
import { useRecaptcha } from '../context/RecaptchaContext';

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/dorms/default.jpg';
  // If it's already a full URL (http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // For relative paths, prepend the backend base URL
  const backendBaseUrl = API_CONFIG.BASE_URL.replace('/api', '');
  return `${backendBaseUrl}${imagePath}`;
};

// Icons
const HomeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const PersonIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const PaymentIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const BedIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
    <path d="M2 17h20"/>
    <path d="M6 8v9"/>
  </svg>
);

const BlockIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18"/>
    <path d="M9 21V9"/>
  </svg>
);

const WifiIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
    <line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
);

const StarIcon = ({ filled = false }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke="#fbbf24" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

const SecureIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const VerifiedIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const EmailIcon = () => (
  <svg className="w-[18px] h-[18px] text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-[18px] h-[18px] text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const BookingPage = () => {
  const { dormId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { executeRecaptcha } = useRecaptcha();

  // State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [dorm, setDorm] = useState(null);
  const [pricing, setPricing] = useState({
    monthlyRent: 0,
    securityDeposit: 0,
    discount: 0,
    totalAmount: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    numberOfOccupants: 1,
    paymentMethod: 'stripe',
    termsAccepted: false
  });

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  // Form errors
  const [formErrors, setFormErrors] = useState({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${dormId}` } });
    }
  }, [isAuthenticated, navigate, dormId]);

  // Prefill form with user data
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || [];
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Fetch dorm and pricing data
  useEffect(() => {
    const fetchData = async () => {
      // Double check authentication before making the call
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const response = await bookingAPI.getBookingPreview(dormId);
        if (response.success) {
          setDorm(response.data.dorm);
          setPricing(response.data.pricing);
        }
      } catch (err) {
        // If unauthorized, redirect to login (session might have expired)
        if (err.response?.status === 401) {
          navigate('/login', { state: { from: `/booking/${dormId}` } });
          return;
        }
        console.error('Error fetching booking data:', err);
        setError('Failed to load booking information');
      } finally {
        setLoading(false);
      }
    };

    if (dormId && isAuthenticated) {
      fetchData();
    }
  }, [dormId, isAuthenticated]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^(\+977)?[0-9]{10,11}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!formData.termsAccepted) {
      errors.termsAccepted = 'You must accept the terms and conditions';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Apply promo code
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      setPromoLoading(true);
      setPromoError('');
      const response = await bookingAPI.validatePromoCode(promoCode, pricing.monthlyRent + pricing.securityDeposit);
      if (response.success) {
        setPricing(prev => ({
          ...prev,
          discount: response.data.discount,
          totalAmount: prev.monthlyRent + prev.securityDeposit - response.data.discount
        }));
        setPromoApplied(true);
      }
    } catch (err) {
      setPromoError(err.response?.data?.error || 'Invalid promo code');
      setPromoApplied(false);
    } finally {
      setPromoLoading(false);
    }
  };

  // Remove promo code
  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoError('');
    setPricing(prev => ({
      ...prev,
      discount: 0,
      totalAmount: prev.monthlyRent + prev.securityDeposit
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      setError(null);

      // Get reCAPTCHA token for bot protection
      const recaptchaToken = await executeRecaptcha('booking');

      const bookingData = {
        dormId,
        ...formData,
        promoCode: promoApplied ? promoCode : null,
        guests: formData.numberOfOccupants, // Use standard key expected by backend
        totalAmount: pricing.totalAmount, // Ensure totalAmount is sent
        discount: pricing.discount // Send discount if applied
      };

      // Use Stripe Checkout
      const response = await paymentAPI.createStripeCheckoutSession(bookingData, recaptchaToken);

      if (response.success && response.url) {
        // Redirect to Stripe
        window.location.href = response.url;
      } else {
        setError('Failed to initiate payment session');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.response?.data?.error || 'Failed to complete booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex justify-center items-center p-8">
          <Loading />
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !dorm) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center p-8 gap-6">
          <ErrorMessage message={error} />
          <button onClick={() => navigate(-1)} className="px-6 py-3 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors">
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left Section - Form */}
          <div className="flex flex-col gap-6">
            {/* Selected Dorm */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-[#1e3a5f]">
                  <HomeIcon />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Your Selected Dorm</h2>
              </div>

              {dorm && (
                <div className="flex gap-4 p-2 bg-slate-50 rounded-lg">
                  <div className="w-36 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(dorm.image)}
                      alt={dorm.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/images/dorms/default.jpg'; }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <h3 className="text-base font-semibold text-slate-800">{dorm.name}</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <BedIcon /> {dorm.beds} Bed
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <BlockIcon /> Block {dorm.block}
                      </span>
                    </div>
                    {dorm.amenities?.includes('WiFi') && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <WifiIcon /> WiFi
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-1">
                      <StarIcon filled />
                      <span className="font-semibold text-slate-800 text-sm">{dorm.rating?.toFixed(1) || '0.0'}</span>
                      <span className="text-xs text-blue-500">({dorm.totalReviews || 0} reviews)</span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Person Information */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-[#1e3a5f]">
                  <PersonIcon />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Person Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className={`px-4 py-3 border rounded-lg text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${formErrors.firstName ? 'border-red-500' : 'border-slate-200'}`}
                    />
                    {formErrors.firstName && <span className="text-xs text-red-500">{formErrors.firstName}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className={`px-4 py-3 border rounded-lg text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${formErrors.lastName ? 'border-red-500' : 'border-slate-200'}`}
                    />
                    {formErrors.lastName && <span className="text-xs text-red-500">{formErrors.lastName}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                        <EmailIcon />
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${formErrors.email ? 'border-red-500' : 'border-slate-200'}`}
                      />
                    </div>
                    {formErrors.email && <span className="text-xs text-red-500">{formErrors.email}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                        <PhoneIcon />
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+977 98XXXXXXXX"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${formErrors.phone ? 'border-red-500' : 'border-slate-200'}`}
                      />
                    </div>
                    {formErrors.phone && <span className="text-xs text-red-500">{formErrors.phone}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="numberOfOccupants" className="text-sm font-medium text-slate-700">
                    Number of Occupants <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="numberOfOccupants"
                    name="numberOfOccupants"
                    value={formData.numberOfOccupants}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value={1}>1 Person</option>
                    <option value={2}>2 Persons</option>
                    <option value={3}>3 Persons</option>
                    <option value={4}>4 Persons</option>
                  </select>
                </div>
              </form>
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-[#1e3a5f]">
                  <PaymentIcon />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Payment Method</h2>
              </div>

              <div className="flex flex-col gap-3 mb-5">
                <div className="p-4 border-2 border-blue-500 bg-blue-50 rounded-xl flex items-center gap-4">
                   <div className="w-12 h-8 bg-white rounded border border-slate-200 flex items-center justify-center text-blue-600 font-bold italic tracking-tighter">
                      Stripe
                   </div>
                   <div>
                     <h4 className="text-sm font-semibold text-slate-800">Credit / Debit Card</h4>
                     <p className="text-xs text-slate-500">Secure payment via Stripe</p>
                   </div>
                   <div className="ml-auto text-blue-600">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                   </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <div className={`w-[18px] h-[18px] border-2 rounded flex-shrink-0 mt-0.5 relative transition-all ${formData.termsAccepted ? 'bg-blue-500 border-blue-500' : formErrors.termsAccepted ? 'border-red-500' : 'border-slate-300'}`}>
                    {formData.termsAccepted && (
                      <svg className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-500 hover:underline">Terms of Service</Link>,{' '}
                    <Link to="/agreement" className="text-blue-500 hover:underline">Agreement</Link>, and{' '}
                    <Link to="/cancellation" className="text-blue-500 hover:underline">Cancellation Policy</Link>.
                    I understand that rules and regulations of this hostel.
                  </span>
                </label>
                {formErrors.termsAccepted && <span className="block text-xs text-red-500 mt-2 ml-7">{formErrors.termsAccepted}</span>}
              </div>
            </section>
          </div>

          {/* Right Section - Price Summary */}
          <div className="lg:sticky lg:top-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-[#4A90B8] px-5 py-4">
                <h3 className="text-white font-semibold">Price Summary</h3>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-slate-500">Monthly Rent</span>
                  <span className="text-slate-800 font-medium">Rs {pricing.monthlyRent.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-slate-500">Security Deposit</span>
                  <span className="text-slate-800 font-medium">Rs {pricing.securityDeposit.toLocaleString()}</span>
                </div>

                {pricing.discount > 0 && (
                  <div className="flex justify-between items-center py-2 text-sm">
                    <span className="text-slate-500">Discount</span>
                    <span className="text-green-500 font-medium">- Rs {pricing.discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="h-px bg-slate-200 my-3"></div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-slate-800">Total Due Today</span>
                  <span className="text-xl font-bold text-red-500">Rs {pricing.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="px-5 pb-5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                    disabled={promoApplied || promoLoading}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                  {promoApplied ? (
                    <button type="button" onClick={handleRemovePromo} className="px-5 py-3 bg-red-50 text-red-500 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors whitespace-nowrap">
                      Remove
                    </button>
                  ) : (
                    <button type="button" onClick={handleApplyPromo} disabled={!promoCode.trim() || promoLoading} className="px-5 py-3 bg-blue-50 text-[#1e3a5f] rounded-lg text-sm font-medium hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
                      {promoLoading ? 'Applying...' : 'Apply'}
                    </button>
                  )}
                </div>
                {promoError && <span className="block text-xs text-red-500 mt-2">{promoError}</span>}
                {promoApplied && <span className="block text-xs text-green-500 mt-2">Promo code applied!</span>}
              </div>

              {/* Complete Booking Button */}
              <div className="px-5 pb-5">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#4A90B8] text-white rounded-lg font-semibold hover:bg-[#2d4a6f] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Processing...' : 'Pay with Stripe'}
                  <ChevronRightIcon />
                </button>
              </div>

              {error && (
                <div className="px-5 pb-4">
                  <ErrorMessage message={error} />
                </div>
              )}

              {/* Security Badges */}
              <div className="flex justify-center gap-6 py-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <SecureIcon />
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <VerifiedIcon />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;
