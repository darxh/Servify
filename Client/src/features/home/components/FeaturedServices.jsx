import { useRef } from "react";
import { Link } from "react-router-dom";
import { useServices } from "../../../hooks/useServices";
import { Star, MapPin, ChevronLeft, ChevronRight, ArrowRight, User } from "lucide-react";
import { formatINR } from "../../../utils/formatCurrency";

const FeaturedServices = () => { 
  const { data: services = [], isLoading, isError } = useServices(); 
  
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef.current;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const getServiceImage = (service) => {
    if (service.images && service.images.length > 0) return service.images[0];
    if (service.image) return service.image;
    return "https://images.unsplash.com/photo-1581578731117-104f8a3d3dfa?auto=format&fit=crop&q=80";
  };

  const getRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "New";
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (isLoading) return (
    <div className="py-24 flex justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
    </div>
  );
 
  if (isError || !services || services.length === 0) return null;
 
  const displayedServices = services.slice(0, 8);

  return (
    <div className="bg-gray-50/50 py-24 group/section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Featured Services
            </h2>
            <p className="mt-2 text-lg text-gray-500">
              Handpicked professionals for your needs.
            </p>
          </div>
          <Link 
            to="/services" 
            className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All Services <ArrowRight size={16} />
          </Link>
        </div>

        <div className="relative">

          <button 
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl rounded-full p-3 text-gray-700 hover:scale-110 transition-all hidden md:flex opacity-0 group-hover/section:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scrollbar-hide px-2 -mx-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{` .scrollbar-hide::-webkit-scrollbar { display: none; } `}</style>

            {displayedServices.map((service) => (
              <div key={service._id} className="min-w-[300px] md:min-w-[340px] snap-center">
                
                <Link 
                  to={`/services/${service._id}`}
                  className="block group h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                    
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={getServiceImage(service)}
                      alt={service.name}
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm border border-white/50">
                    {formatINR(service.price)}
                    </div>
                    <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                      {service.category?.name || "Service"}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col h-[calc(100%-192px)]">
                    
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                      {service.name}
                    </h3>
                    
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                      {service.description}
                    </p>

                    <div className="border-t border-gray-50 pt-4 mt-auto">
                      
                      <div className="flex items-center justify-between">
                        
                        {/* Provider Avatar */}
                        <div className="flex items-center gap-2">
                           <div className="h-6 w-6 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                              {service.provider?.profileImage ? (
                                <img src={service.provider.profileImage} className="h-full w-full object-cover" alt="Provider" />
                              ) : (
                                <User size={14} className="text-gray-400" />
                              )}
                           </div>
                           <span className="text-xs font-semibold text-gray-600 truncate max-w-[100px]">
                             {service.provider?.name}
                           </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                           <Star size={12} className="fill-orange-400 text-orange-400" /> 
                           <span>{getRating(service.reviews)}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </Link>

              </div>
            ))}
          </div>

          <button 
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 shadow-xl rounded-full p-3 text-gray-700 hover:scale-110 transition-all hidden md:flex opacity-0 group-hover/section:opacity-100"
          >
            <ChevronRight size={24} />
          </button>

        </div>

        <div className="mt-8 text-center md:hidden">
           <Link to="/services" className="inline-block px-6 py-3 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50">
              View All Services
           </Link>
        </div>

      </div>
    </div>
  );
};

export default FeaturedServices;