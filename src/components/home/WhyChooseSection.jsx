import React from 'react';
import { FiClock, FiCheckCircle, FiCreditCard, FiHeart } from 'react-icons/fi';

const benefits = [
  {
    id: 1,
    icon: FiClock,
    title: '24/7 Support',
    description: 'Our dedicated team is always here to help with any questions or concerns',
  },
  {
    id: 2,
    icon: FiCheckCircle,
    title: 'Quality Guaranteed',
    description: 'Every dorms meets our strict quality standards for your peace of mind',
  },
  {
    id: 3,
    icon: FiCreditCard,
    title: 'No Hidden Fees',
    description: 'Transparent pricing with everything included upfront. What you see is what you pay',
  },
  {
    id: 4,
    icon: FiHeart,
    title: 'Trusted Community',
    description: 'Join thousands of satisfied students who found their perfect dorms',
  },
];

const WhyChooseSection = () => {
  return (
    <section className="bg-[#4A90B8] py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <p className="text-[#BADCE8] text-sm font-semibold mb-3">Our Promise</p>
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose Dorm Axis?</h2>
          <p className="text-[#D1E7F0] text-lg max-w-2xl mx-auto">
            We're committed to making your room search stress-free
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={benefit.id}
                className="bg-[#5AA0C8] bg-opacity-40 backdrop-blur-sm rounded-xl p-8 hover:bg-opacity-60 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                  <IconComponent className="text-3xl text-[#4A90B8]" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-[#E8F3F8] leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
