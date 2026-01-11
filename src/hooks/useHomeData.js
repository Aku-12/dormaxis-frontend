import { useEffect } from 'react';
import useHomeStore from '../store/useHomeStore';

const useHomeData = () => {
  const { stats, popularDorms, loading, error, fetchHomePageData } = useHomeStore();

  useEffect(() => {
    fetchHomePageData();
  }, [fetchHomePageData]);

  return {
    stats,
    popularDorms,
    loading,
    error,
    refetch: fetchHomePageData,
  };
};

export default useHomeData;
