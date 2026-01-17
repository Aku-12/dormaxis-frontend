import React from 'react';
import useDormStore from '../../store/useDormStore';

const DormFilters = () => {
  const { 
    filters, 
    filterOptions, 
    updateFilter, 
    toggleAmenity, 
    clearFilters,
    setFilters,
    fetchAllDorms
  } = useDormStore();

  const handlePriceChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handlePriceApply = () => {
    fetchAllDorms();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-semibold text-gray-900">Filters</span>
        </div>
        <button 
          onClick={clearFilters}
          className="text-sm text-[#4A90B8] hover:text-[#3A7A9A] font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Blocks */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Blocks</label>
        <select
          value={filters.block}
          onChange={(e) => updateFilter('block', e.target.value)}
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A90B8] focus:border-transparent text-gray-700"
        >
          <option value="all">All Blocks</option>
          {filterOptions.blocks.map((block) => (
            <option key={block} value={block}>{block}</option>
          ))}
        </select>
      </div>

      {/* Dorms Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Dorms Type</label>
        <select
          value={filters.type}
          onChange={(e) => updateFilter('type', e.target.value)}
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A90B8] focus:border-transparent text-gray-700"
        >
          <option value="all">All Types</option>
          {filterOptions.types.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (per month)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            onBlur={handlePriceApply}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A90B8] focus:border-transparent text-gray-700"
          />
          <span className="text-gray-400">to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            onBlur={handlePriceApply}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A90B8] focus:border-transparent text-gray-700"
          />
        </div>
      </div>

      {/* Beds */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Beds</label>
        <select
          value={filters.beds}
          onChange={(e) => updateFilter('beds', e.target.value)}
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A90B8] focus:border-transparent text-gray-700"
        >
          <option value="any">Any</option>
          {filterOptions.beds.map((bed) => (
            <option key={bed} value={bed}>{bed} {bed === 1 ? 'Bed' : 'Beds'}</option>
          ))}
        </select>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
        <div className="space-y-2.5">
          {filterOptions.amenities.map((amenity) => (
            <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="w-4 h-4 text-[#4A90B8] border-gray-300 rounded focus:ring-[#4A90B8]"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DormFilters;
