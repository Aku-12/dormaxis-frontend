import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Header, Footer, Loading, ErrorMessage } from '../components/common';
import { paymentAPI } from '../api';
import useAuthStore from '../store/useAuthStore';

// Icons
const CheckCircleIcon = () => (
  <svg className="w-16 h-16 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const ReceiptIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/>
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
    <path d="M12 17.5v-11"/>
  </svg>
);

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [transactionCode, setTransactionCode] = useState(null);

  // Get data from URL
  const encodedData = searchParams.get('data');
  const bookingId = searchParams.get('booking_id');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Verify payment
  useEffect(() => {
    const verifyPayment = async () => {
      if (!encodedData || !bookingId) {
        setError('Invalid payment response');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await paymentAPI.verifyEsewaPayment(encodedData, bookingId);
        
        if (response.success) {
          setBooking(response.data.booking);
          setTransactionCode(response.data.transactionCode);
        } else {
          setError(response.error || 'Payment verification failed');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError(err.response?.data?.error || 'Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [encodedData, bookingId]);

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

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center p-8 gap-4">
          <Loading />
          <p className="text-slate-600">Verifying your payment...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center p-8 gap-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Payment Verification Failed</h2>
          <ErrorMessage message={error} />
          <div className="flex gap-4">
            <Link 
              to="/dorms"
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Browse Dorms
            </Link>
            <Link 
              to="/profile"
              className="px-6 py-3 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors"
            >
              View My Bookings
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon />
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-slate-800 mb-3">Payment Successful!</h1>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Your payment has been processed successfully. A confirmation email has been sent to{' '}
              <strong className="text-slate-800">{booking?.email}</strong>
            </p>

            {/* Booking Reference */}
            <div className="bg-green-50 border border-dashed border-green-400 rounded-xl p-4 mb-6">
              <span className="block text-xs text-slate-500 uppercase tracking-wide mb-1">Booking Reference</span>
              <span className="text-2xl font-bold text-green-600 font-mono tracking-widest">
                {booking?.bookingRef}
              </span>
            </div>

            {/* Transaction Details */}
            {transactionCode && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                <span className="block text-xs text-slate-500 uppercase tracking-wide mb-1">eSewa Transaction Code</span>
                <span className="text-lg font-semibold text-slate-800 font-mono">
                  {transactionCode}
                </span>
              </div>
            )}

            {/* Booking Details */}
            <div className="flex flex-col gap-4 mb-6 text-left">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-[#1e3a5f]">
                  <HomeIcon />
                </div>
                <div>
                  <span className="block text-xs text-slate-500 uppercase tracking-wide">Dorm</span>
                  <span className="font-semibold text-slate-800">{booking?.dorm?.name || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-[#1e3a5f]">
                  <CalendarIcon />
                </div>
                <div>
                  <span className="block text-xs text-slate-500 uppercase tracking-wide">Payment Date</span>
                  <span className="font-semibold text-slate-800">{formatDate(booking?.paidAt || new Date())}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-slate-50 rounded-xl p-5 mb-6 text-left">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                <ReceiptIcon />
                Payment Summary
              </h3>
              
              <div className="flex justify-between items-center py-2 text-sm">
                <span className="text-slate-500">Monthly Rent</span>
                <span className="text-slate-800 font-medium">Rs {booking?.monthlyRent?.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 text-sm">
                <span className="text-slate-500">Security Deposit</span>
                <span className="text-slate-800 font-medium">Rs {booking?.securityDeposit?.toLocaleString()}</span>
              </div>
              
              {booking?.discount > 0 && (
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-slate-500">Discount</span>
                  <span className="text-green-500 font-medium">- Rs {booking?.discount?.toLocaleString()}</span>
                </div>
              )}
              
              <div className="h-px bg-slate-200 my-3"></div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold text-slate-800">Total Paid</span>
                <span className="text-xl font-bold text-green-600">Rs {booking?.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex justify-center gap-4 mb-6">
              <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                ✓ Booking Confirmed
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                ✓ Payment Complete
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/profile"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#1e3a5f] text-white rounded-lg font-semibold hover:bg-[#2d4a6f] transition-colors"
              >
                View My Bookings
              </Link>
              <Link
                to="/dorms"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
              >
                Browse More Dorms
              </Link>
            </div>

            {/* Help Text */}
            <p className="text-xs text-slate-400 mt-6">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
