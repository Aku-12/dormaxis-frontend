import { useEffect } from 'react';
import useDormStore from '../store/useDormStore';

const useDorms = (filters = {}) => {
  const { dorms, loading, error, fetchAllDorms } = useDormStore();

  useEffect(() => {
    fetchAllDorms(filters);
  }, [fetchAllDorms, JSON.stringify(filters)]);

  return {
    dorms,
    loading,
    error,
    refetch: () => fetchAllDorms(filters),
  };
};

export default useDorms;
