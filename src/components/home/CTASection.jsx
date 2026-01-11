import React from 'react';

const CTASection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">Ready to Find Your New Dorm?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join hundreds of students who've already found their perfect accommodation with Dorm Axis.
          Start your search today and discover comfortable, affordable student housing.
        </p>
        <a
          href="#signup"
          className="inline-block px-10 py-4 bg-[#4A90B8] text-white rounded-lg font-semibold hover:bg-[#3A7A9A] transition-colors shadow-lg hover:shadow-xl"
        >
          Get Started Now
        </a>
      </div>
    </section>
  );
};

export default CTASection;
