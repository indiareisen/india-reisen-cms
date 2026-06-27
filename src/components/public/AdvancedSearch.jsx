import { useState } from 'react';

const AdvancedSearch = ({ journeys, onFilter }) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    minPrice: 0,
    maxPrice: 200000,
    minDuration: 1,
    maxDuration: 30,
    availability: true,
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    filterResults();
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = { ...filters, [name]: type === 'checkbox' ? checked : value };
    setFilters(newFilters);
    filterResults(newFilters);
  };

  const filterResults = (filtersToUse = filters) => {
    let filtered = journeys;

    if (search) {
      filtered = filtered.filter(j =>
        j.title?.toLowerCase().includes(search.toLowerCase()) ||
        j.destination?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filtersToUse.difficulty) {
      filtered = filtered.filter(j => j.difficulty === filtersToUse.difficulty);
    }

    filtered = filtered.filter(j =>
      j.basePrice >= filtersToUse.minPrice && j.basePrice <= filtersToUse.maxPrice &&
      j.duration >= filtersToUse.minDuration && j.duration <= filtersToUse.maxDuration
    );

    if (filtersToUse.availability) {
      filtered = filtered.filter(j => j.availability === true);
    }

    onFilter(filtered);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Journey</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search journeys..."
          className="col-span-1 md:col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
        />

        {/* Difficulty */}
        <select
          name="difficulty"
          value={filters.difficulty}
          onChange={handleFilterChange}
          className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
        >
          <option value="">All Levels</option>
          <option>Easy</option>
          <option>Moderate</option>
          <option>Challenging</option>
          <option>Expert</option>
        </select>

        {/* Price Range */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            name="minPrice"
            min="0"
            max="200000"
            step="10000"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="flex-1"
          />
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">₹{(filters.minPrice / 1000).toFixed(0)}k</span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            name="minDuration"
            min="1"
            max="30"
            value={filters.minDuration}
            onChange={handleFilterChange}
            className="flex-1"
          />
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{filters.minDuration}d</span>
        </div>

        {/* Availability */}
        <label className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-pink-500 cursor-pointer">
          <input
            type="checkbox"
            name="availability"
            checked={filters.availability}
            onChange={handleFilterChange}
            className="w-5 h-5"
          />
          <span className="text-sm font-semibold text-gray-700">Available Only</span>
        </label>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Price: ₹{filters.minPrice.toLocaleString()} - ₹{filters.maxPrice.toLocaleString()} | Duration: {filters.minDuration}-{filters.maxDuration} days
      </div>
    </div>
  );
};

export default AdvancedSearch;
