import { Search, RotateCcw, Filter } from "lucide-react";
import { useCategories } from "../../../hooks/useCategories";

const ServiceFilter = ({ filters, setFilters, onClose }) => {
  const { data: categories } = useCategories();

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
    });
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

      {/*  Sorting */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Sort By</label>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
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