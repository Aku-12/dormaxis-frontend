import React from 'react';
import { Header, Footer, Loading, ErrorMessage } from '../components/common';
import {
  HeroSection,
  FeaturesSection,
  PopularDormsSection,
  WhyChooseSection,
  CTASection,
} from '../components/home';
import { useHomeData } from '../hooks';

const HomePage = () => {
  const { stats, popularDorms, loading, error, refetch } = useHomeData();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection stats={stats} />
      <FeaturesSection />
      <PopularDormsSection dorms={popularDorms} />
      <WhyChooseSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
