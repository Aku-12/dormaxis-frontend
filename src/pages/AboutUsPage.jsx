import React from 'react';
import { Header, Footer } from '../components/common';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#4A90B8] to-[#3A7A9A] text-white py-20">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Dorm Axis</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Making student accommodation affordable, accessible, and stress-free across Nepal.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                At Dorm Axis, we believe every student deserves a safe, comfortable, and affordable place to call home during their academic journey.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our mission is to bridge the gap between students seeking accommodation and quality dorm providers, making the search process simple and transparent.
              </p>
            </div>
            <div className="bg-[#E8F3F8] rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#4A90B8]">500+</div>
                  <div className="text-gray-600 mt-2">Dorms Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#4A90B8]">10K+</div>
                  <div className="text-gray-600 mt-2">Happy Students</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#4A90B8]">50+</div>
                  <div className="text-gray-600 mt-2">Cities Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#4A90B8]">24/7</div>
                  <div className="text-gray-600 mt-2">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              How a simple idea transformed into Nepal's leading student accommodation platform
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Dorm Axis was founded by a group of former students who experienced firsthand the challenges of finding suitable accommodation during their college years. The endless searches, unreliable listings, and lack of transparency made what should be an exciting time incredibly stressful.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                In 2023, we set out to change this. We built a platform that puts students first, offering verified listings, transparent pricing, and genuine reviews from fellow students.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Today, Dorm Axis has helped thousands of students find their perfect home away from home, and we're just getting started.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#E8F3F8] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[#4A90B8] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Safety</h3>
              <p className="text-gray-600">
                Every listing is verified to ensure students find safe and reliable accommodation.
              </p>
            </div>
            <div className="bg-[#E8F3F8] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[#4A90B8] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-600">
                We build connections between students and create a supportive community.
              </p>
            </div>
            <div className="bg-[#E8F3F8] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[#4A90B8] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Simplicity</h3>
              <p className="text-gray-600">
                Finding accommodation should be easy. We keep our platform simple and intuitive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Dorm Axis
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: 'Rajesh Sharma', role: 'Founder & CEO' },
              { name: 'Priya Thapa', role: 'Head of Operations' },
              { name: 'Anil Gurung', role: 'Tech Lead' },
              { name: 'Sita Rai', role: 'Customer Success' },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-[#4A90B8] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl text-white font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-[#4A90B8]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#4A90B8]">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Perfect Dorm?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their home away from home with Dorm Axis.
          </p>
          <a
            href="/dorms"
            className="inline-block px-8 py-4 bg-white text-[#4A90B8] font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse Dorms
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
