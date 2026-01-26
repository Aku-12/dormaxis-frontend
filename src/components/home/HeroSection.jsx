import React from 'react';

const HeroSection = ({ stats }) => {
  return (
    <section className="bg-gray-50 py-20" id="home">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-12">
          {/* Left - Text Content */}
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Find Your <span className="text-[#4A90B8]">Perfect Dorms</span> in Seconds
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Discover comfortable and affordable student housing tailored to your needs. Browse, compare, and book your ideal dorm with ease.
            </p>

            {/* Stats */}
            <div className="flex gap-12 mb-8">
              <div>
                <div className="text-4xl font-bold text-gray-900">{stats.students}+</div>
                <div className="text-sm text-gray-500 mt-1">Happy Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900">{stats.dorms}+</div>
                <div className="text-sm text-gray-500 mt-1">Available Dorms</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900">{stats.rating}</div>
                <div className="text-sm text-gray-500 mt-1">Average Rating</div>
              </div>
            </div>


          </div>

          {/* Right - Hero Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop"
                alt="Modern dorm living room"
                className="w-full h-[500px] object-cover"
              />
            </div>

            {/* Floating Badge - Instant Booking */}
            <div className="absolute top-8 left-8 bg-white rounded-xl px-5 py-3 shadow-lg flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E8F3F8] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#4A90B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Instant Booking</div>
                <div className="text-xs text-gray-500">Book authentic dorms</div>
              </div>
            </div>

            {/* Floating Badge - Secure Payment */}
            <div className="absolute bottom-8 right-8 bg-white rounded-xl px-5 py-3 shadow-lg flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E8F3F8] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#4A90B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Secure Payment</div>
                <div className="text-xs text-gray-500">Safe transactions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
