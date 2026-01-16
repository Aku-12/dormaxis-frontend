import { create } from 'zustand';
import { dormsAPI, wishlistAPI } from '../api';

const useDormStore = create((set, get) => ({
  // State
  dorms: [],
  currentDorm: null,
  filters: {
    block: 'all',
    type: 'all',
    minPrice: '',
    maxPrice: '',
    beds: 'any',
    amenities: [],
    sort: 'recommended',
    page: 1,
    limit: 12,
  },
  filterOptions: {
    blocks: [],
    types: [],
    beds: [],
    amenities: [],
    priceRange: { minPrice: 0, maxPrice: 50000 },
  },
  pagination: {
    total: 0,
    page: 1,
    totalPages: 1,
  },
  wishlist: [],
  loading: false,
  filtersLoading: false,
  error: null,

  // Fetch filter options (blocks, types, etc.)
  fetchFilterOptions: async () => {
    set({ filtersLoading: true });
    try {
      const response = await dormsAPI.getFilterOptions();
      if (response.success) {
        set({ filterOptions: response.data, filtersLoading: false });
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
      set({ filtersLoading: false });
    }
  },

  // Fetch dorms with filters
  fetchAllDorms: async (customFilters = null) => {
    const filters = customFilters || get().filters;
    set({ loading: true, error: null });
    
    try {
      // Build query params, excluding empty/default values
      const params = {};
      if (filters.block && filters.block !== 'all') params.block = filters.block;
      if (filters.type && filters.type !== 'all') params.type = filters.type;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.beds && filters.beds !== 'any') params.beds = filters.beds;
      if (filters.amenities?.length > 0) params.amenities = filters.amenities.join(',');
      if (filters.sort) params.sort = filters.sort;
      params.page = filters.page || 1;
      params.limit = filters.limit || 12;

      const response = await dormsAPI.getAllDorms(params);
      if (response.success) {
        set({
          dorms: response.data,
          pagination: {
            total: response.total,
            page: response.page,
            totalPages: response.totalPages,
          },
          loading: false,
        });
      } else {
        set({ error: 'Failed to fetch dorms', loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message || 'An error occurred',
        loading: false,
      });
    }
  },

  // Update a single filter and refetch
  updateFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: 1 }, // Reset page when filter changes
    }));
    get().fetchAllDorms();
  },

  // Update multiple filters
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  // Clear all filters
  clearFilters: () => {
    set({
      filters: {
        block: 'all',
        type: 'all',
        minPrice: '',
        maxPrice: '',
        beds: 'any',
        amenities: [],
        sort: 'recommended',
        page: 1,
        limit: 12,
      },
    });
    get().fetchAllDorms();
  },

  // Toggle amenity filter
  toggleAmenity: (amenity) => {
    set((state) => {
      const amenities = state.filters.amenities.includes(amenity)
        ? state.filters.amenities.filter((a) => a !== amenity)
        : [...state.filters.amenities, amenity];
      return { filters: { ...state.filters, amenities, page: 1 } };
    });
    get().fetchAllDorms();
  },

  // Change page
  goToPage: (page) => {
    set((state) => ({
      filters: { ...state.filters, page },
    }));
    get().fetchAllDorms();
  },

  // Fetch single dorm
  fetchDormById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await dormsAPI.getDormById(id);
      if (response.success) {
        set({ currentDorm: response.data, loading: false });
      } else {
        set({ error: 'Failed to fetch dorm', loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message || 'An error occurred',
        loading: false,
      });
    }
  },

  // Wishlist actions
  fetchWishlist: async () => {
    try {
      const response = await wishlistAPI.getWishlist();
      if (response.success) {
        set({ wishlist: response.data.map((d) => d._id) });
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  },

  toggleWishlist: async (dormId) => {
    const { wishlist } = get();
    const isInWishlist = wishlist.includes(dormId);

    try {
      if (isInWishlist) {
        await wishlistAPI.removeFromWishlist(dormId);
        set({ wishlist: wishlist.filter((id) => id !== dormId) });
      } else {
        await wishlistAPI.addToWishlist(dormId);
        set({ wishlist: [...wishlist, dormId] });
      }
      return true;
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return false;
    }
  },

  isInWishlist: (dormId) => {
    return get().wishlist.includes(dormId);
  },

  // Admin CRUD operations
  createDorm: async (dormData) => {
    set({ loading: true, error: null });
    try {
      const response = await dormsAPI.createDorm(dormData);
      if (response.success) {
        set((state) => ({
          dorms: [...state.dorms, response.data],
          loading: false,
        }));
        return response.data;
      } else {
        set({ error: 'Failed to create dorm', loading: false });
        return null;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message || 'An error occurred',
        loading: false,
      });
      return null;
    }
  },

  updateDorm: async (id, dormData) => {
    set({ loading: true, error: null });
    try {
      const response = await dormsAPI.updateDorm(id, dormData);
      if (response.success) {
        set((state) => ({
          dorms: state.dorms.map((dorm) =>
            dorm._id === id ? response.data : dorm
          ),
          currentDorm: response.data,
          loading: false,
        }));
        return response.data;
      } else {
        set({ error: 'Failed to update dorm', loading: false });
        return null;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message || 'An error occurred',
        loading: false,
      });
      return null;
    }
  },

  deleteDorm: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await dormsAPI.deleteDorm(id);
      if (response.success) {
        set((state) => ({
          dorms: state.dorms.filter((dorm) => dorm._id !== id),
          loading: false,
        }));
        return true;
      } else {
        set({ error: 'Failed to delete dorm', loading: false });
        return false;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message || 'An error occurred',
        loading: false,
      });
      return false;
    }
  },

  // Clear current dorm
  clearCurrentDorm: () => {
    set({ currentDorm: null });
  },

  // Reset store
  resetDormStore: () => {
    set({
      dorms: [],
      currentDorm: null,
      filters: {
        block: 'all',
        type: 'all',
        minPrice: '',
        maxPrice: '',
        beds: 'any',
        amenities: [],
        sort: 'recommended',
        page: 1,
        limit: 12,
      },
      pagination: { total: 0, page: 1, totalPages: 1 },
      wishlist: [],
      loading: false,
      error: null,
    });
  },
}));

export default useDormStore;
