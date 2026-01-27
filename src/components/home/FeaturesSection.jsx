import React from 'react';
import { FiSearch, FiZap, FiShield, FiDollarSign } from 'react-icons/fi';
import FeatureCard from './FeatureCard';

const features = [
  {
    id: 1,
    icon: FiSearch,
    title: 'Easy Search',
    description: 'Find dorms quickly with smart filters',
  },
  {
    id: 2,
    icon: FiZap,
    title: 'Instant Booking',
    description: 'Reserve your dorm in just one click',
  },
  {
    id: 3,
    icon: FiShield,
    title: 'Secure Payment',
    description: 'Save online transaction everytime',
  },
  {
    id: 4,
    icon: FiDollarSign,
    title: 'Affordable Choices',
    description: 'Competitive pricing with no hidden fees. Find dorms that fit every budget',
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <p className="text-[#4A90B8] text-sm font-semibold mb-3">Why Urban Homes?</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need for a Perfect Stay</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">We've simplified the dorm hunting process so you can focus on what matters most</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
