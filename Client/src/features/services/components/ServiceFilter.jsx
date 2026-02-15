import { useState } from "react";
import { Search, RotateCcw, Filter, MapPin, Loader2, X } from "lucide-react";
import { useCategories } from "../../../hooks/useCategories";

const ServiceFilter = ({ filters, setFilters, onClose }) => {
  const { data: categories } = useCategories();

  const [locationLoading, setLocationLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
      lat: "",
      lng: "",
      radius: 50,
    });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFilters((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          radius: 50,
          sort: "",
        }));
        setLocationLoading(false);
      },
      (error) => {
        console.error(error);
        alert("Could not get your location. Please allow location permissions in your browser.");
        setLocationLoading(false);
      }
    );
  };

  const clearLocation = () => {
    setFilters((prev) => ({ ...prev, lat: "", lng: "", radius: 50 }));
  };

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between lg:hidden mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Filter size={20} /> Filters
        </h3>
        {onClose && (
          <button onClick={onClose} className="text-sm text-blue-600 font-semibold">
            Done
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Location</label>
        {filters.lat && filters.lng ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
              <MapPin size={16} />
              <span>Nearby (within 50km)</span>
            </div>
            <button onClick={clearLocation} className="text-green-700 hover:bg-green-100 p-1 rounded-md transition-colors">
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={detectLocation}
            disabled={locationLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors disabled:opacity-70"
          >
            {locationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
            Find Services Near Me
          </button>
        )}
      </div>

      {/* Search Keyword */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
            placeholder="e.g. Cleaning, Repair..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Price Range</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min"
              className="w-full pl-6 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max"
              className="w-full pl-6 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Sorting */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Sort By</label>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          disabled={filters.lat && filters.lng} // Disable manual sort if Location is active
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        {filters.lat && filters.lng && (
          <p className="text-xs text-gray-500 mt-2">Sorting disabled: Results are currently sorted by distance.</p>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Clear Button */}
      <button
        onClick={clearFilters}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
      >
        <RotateCcw size={16} /> Reset Filters
      </button>

    </div>
  );
};

export default ServiceFilter;