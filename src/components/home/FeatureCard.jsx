import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
      <div className="w-20 h-20 mx-auto mb-6 bg-[#E8F3F8] rounded-full flex items-center justify-center">
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
