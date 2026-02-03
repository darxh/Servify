import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useServices } from "../../hooks/useServices";
import ServiceFilter from "../../features/services/components/ServiceFilter";
import { MapPin, Clock, Filter, X, Star, ArrowLeft } from "lucide-react";
import { formatINR } from "../../utils/formatCurrency";

const ServicesPage = () => {
  const [searchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const initialKeyword = searchParams.get("keyword") || "";
  const initialCategory = searchParams.get("category") || "";

  const [filters, setFilters] = useState({
    keyword: initialKeyword,
    category: initialCategory,
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      keyword: searchParams.get("keyword") || "",
      category: searchParams.get("category") || "",
    }));
  }, [searchParams]);

  const { data: services, isLoading, isError } = useServices(filters);

  const getServiceImage = (service) => {
    if (service.images && service.images.length > 0) return service.images[0];
    if (service.image) return service.image;
    return "https://images.unsplash.com/photo-1581578731117-104f8a3d3dfa?auto=format&fit=crop&q=80";
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-200 pt-8 pb-12">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
             
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 mb-6 transition-colors"
            >
              <ArrowLeft size={18} /> Back to Home
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">Explore Services</h1>
            <p className="mt-2 text-lg text-gray-600 max-w-2xl">
              {filters.keyword 
                ? `Showing results for "${filters.keyword}"`
                : "Find the best professionals for your needs, from cleaning to repairs."}
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        
        {/* Mob Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-3 rounded-xl font-semibold shadow-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <Filter size={18} /> Show Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* sidebar filter */}
          <aside className={`
            lg:w-64 flex-shrink-0
            ${showMobileFilters ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden lg:block"}
          `}>
             <div className="flex justify-between items-center lg:hidden mb-6">
                <span className="font-bold text-lg">Filters</span>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <X size={20} />
                </button>
             </div>
             
             <div className="lg:sticky lg:top-24">
                <ServiceFilter 
                  filters={filters} 
                  setFilters={setFilters} 
                  onClose={() => setShowMobileFilters(false)} 
                />
             </div>
          </aside>

          {/* main results grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-20 bg-red-50 rounded-2xl text-red-600 border border-red-100">
                <p className="font-bold">Failed to load services.</p>
                <button onClick={() => window.location.reload()} className="underline mt-2 hover:text-red-800">Try Again</button>
              </div>
            ) : services?.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400">
                  <Filter size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No services found</h3>
                <p className="mt-2 text-gray-500">
                  We couldn't find any matches. <br/> Try adjusting your filters.
                </p>
                <button 
                  onClick={() => setFilters({ keyword: "", category: "", minPrice: "", maxPrice: "", sort: "newest" })}
                  className="mt-6 px-6 py-2.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition shadow-lg"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Link 
                    key={service._id} 
                    to={`/services/${service._id}`}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="relative h-48 bg-gray-200 overflow-hidden shrink-0">
                      <img 
                        src={getServiceImage(service)} 
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                        {formatINR(service.price)}
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-3">
                         <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                           {service.category?.name || "General"}
                         </span>
                         <div className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                           <Star size={12} className="fill-orange-400 text-orange-400" /> 4.8
                         </div>
                      </div>

                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </h3>
                      
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto text-sm text-gray-500">
                         <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-gray-400" />
                            <span className="truncate max-w-[100px]">{service.provider?.name}</span>
                         </div>
                         <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-400" />
                            <span>{service.duration}m</span>
                         </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;