import React from 'react';
import DormCard from './DormCard';

const PopularDormsSection = ({ dorms }) => {
  return (
    <section className="bg-white py-20" id="dorms">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <p className="text-[#4A90B8] text-sm font-semibold mb-2">Featured Listings</p>
            <h2 className="text-4xl font-bold text-gray-900">Popular Dorms</h2>
            <p className="text-gray-600 mt-2">Hand-picked dorms loved by our community</p>
          </div>
          <a href="#" className="text-[#4A90B8] hover:text-[#3A7A9A] font-medium flex items-center gap-2">
            View all rooms
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dorms.map((dorm) => (
            <DormCard key={dorm._id} dorm={dorm} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDormsSection;
