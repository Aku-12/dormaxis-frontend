import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link, useParams, useSearchParams } from 'react-router-dom';
import { Header, Footer, Loading } from '../components/common';
import { paymentAPI } from '../api';

const CheckCircleIcon = () => (
  <svg className="w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const HomeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking && !!sessionId);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyStripe = async () => {
      if (sessionId && bookingId && !booking) {
        try {
          setLoading(true);
          const response = await paymentAPI.verifyStripePayment(sessionId, bookingId);
          if (response.success) {
            setBooking(response.data.booking);
          } else {
            setError(response.error || 'Payment verification failed');
          }
        } catch (err) {
          console.error('Verification error:', err);
          setError('Failed to verify payment');
        } finally {
          setLoading(false);
        }
      }
    };

    if (sessionId) verifyStripe();
  }, [sessionId, bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <Loading />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
       <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Payment Verification Failed</h2>
          <p className="text-slate-600 mb-6">{error}</p>
           <Link to="/dorms" className="text-blue-600 hover:underline">Return to Dorms</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Redirect if no booking data and not verifying
  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center py-12 px-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">No booking information found</h2>
            <p className="text-slate-500 mb-6">Please try making a new booking.</p>
            <Link to="/dorms" className="inline-block px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#2d4a6f] transition-colors">
              Browse Dorms
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-700',
      paid: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon />
            </div>


            {/* Success Message */}
            <h1 className="text-2xl font-bold text-slate-800 mb-3">Booking Confirmed!</h1>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Your booking has been successfully placed. We've sent a confirmation email to{' '}
              <strong className="text-slate-800">{booking.email}</strong>
            </p>

            {/* Booking Reference */}
            <div className="bg-blue-50 border border-dashed border-blue-400 rounded-xl p-4 mb-6">
              <span className="block text-xs text-slate-500 uppercase tracking-wide mb-1">Booking Reference</span>
              <span className="text-2xl font-bold text-[#1e3a5f] font-mono tracking-widest">{booking.bookingRef}</span>
            </div>

            {/* Booking Details */}
            <div className="flex flex-col gap-4 mb-6 text-left">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-[#1e3a5f]">
                  <HomeIcon />
                </div>
                <div>
                  <span className="block text-xs text-slate-500 uppercase tracking-wide">Dorm</span>
                  <span className="font-semibold text-slate-800">{booking.dorm?.name || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-[#1e3a5f]">
                  <CalendarIcon />
                </div>
                <div>
                  <span className="block text-xs text-slate-500 uppercase tracking-wide">Booking Date</span>
                  <span className="font-semibold text-slate-800">{formatDate(booking.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-slate-50 rounded-xl p-5 mb-6 text-left">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4">Payment Summary</h3>
              
              <div className="flex justify-between items-center py-2 text-sm">
                <span className="text-slate-500">Monthly Rent</span>
                <span className="text-slate-800 font-medium">Rs {booking.monthlyRent?.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 text-sm">
                <span className="text-slate-500">Security Deposit</span>
                <span className="text-slate-800 font-medium">Rs {booking.securityDeposit?.toLocaleString()}</span>
              </div>
              
              {booking.discount > 0 && (
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-slate-500">Discount</span>
                  <span className="text-green-500 font-medium">- Rs {booking.discount?.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-800">Total Paid</span>
                <span className="font-bold text-slate-800">Rs {booking.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex justify-center gap-3 mb-6 flex-wrap">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                Payment: {booking.paymentStatus?.charAt(0).toUpperCase() + booking.paymentStatus?.slice(1)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <Link to="/profile" className="flex-1 py-3 px-6 bg-slate-100 text-slate-800 rounded-lg font-semibold text-center hover:bg-slate-200 transition-colors">
                View My Bookings
              </Link>
              <Link to="/dorms" className="flex-1 py-3 px-6 bg-[#1e3a5f] text-white rounded-lg font-semibold text-center hover:bg-[#2d4a6f] transition-colors">
                Browse More Dorms
              </Link>
            </div>

            {/* Help Text */}
            <p className="text-xs text-slate-500">
              Need help? Contact us at <a href="mailto:support@dormaxis.com" className="text-blue-500 hover:underline">support@dormaxis.com</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingSuccessPage;
