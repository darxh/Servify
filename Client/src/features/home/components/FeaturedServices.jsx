import { useRef } from "react";
import { Link } from "react-router-dom";
import { useServices } from "../../../hooks/useServices";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const FeaturedServices = () => { 
  // 1. Data Fetching
  const { data, isLoading, isError, error } = useServices();
  
  // Safe check: handle if 'data' is the array or if 'data.services' is the array
  const servicesList = data?.services || data || [];
  
  // 2. Logic: Show top 10 services instead of just 3
  const services = servicesList.slice(0, 10);
  
  // 3. Scroll Logic
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef.current;
      const scrollAmount = direction === "left" ? -350 : 350; // Scroll by roughly one card width
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // --- LOADING / ERROR STATES (Kept Exactly as you had them) ---
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }
 
  if (isError) {
    return (
      <div className="bg-white py-12 text-center">
        <p className="text-red-500">Error loading services: {error.message}</p>
        <p className="text-sm text-gray-500">Is your backend server running?</p>
      </div>
    );
  }
 
  if (!services || services.length === 0) {
    return (
      <div className="bg-white py-12 text-center">
        <p className="text-gray-500">No services found available right now.</p>
      </div>
    );
  }
 
  return (
    <div className="bg-white py-24 sm:py-32 group/section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Top Rated Services
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Highly recommended professionals near you.
          </p>
        </div>

        {/* --- SCROLLABLE CONTAINER WRAPPER --- */}
        <div className="relative">

          {/* Left Arrow Button */}
          <button 
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white border border-gray-200 shadow-lg rounded-full p-3 text-gray-700 hover:scale-110 transition-all hidden md:flex opacity-0 group-hover/section:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>

          {/* The Scroll List (Replaces the Grid) */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scrollbar-hide px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Hide Scrollbar Style */}
            <style>{` .scrollbar-hide::-webkit-scrollbar { display: none; } `}</style>

            {services.map((service) => (
              <div key={service._id} className="min-w-[320px] md:min-w-[380px] snap-center flex">
                
                {/* --- YOUR EXACT CARD DESIGN (Copied Verbatim) --- */}
                <article className="flex w-full flex-col items-start justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                    
                  <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={
                        (service.images && service.images.length > 0) 
                          ? service.images[0] 
                          : (service.image || "https://plus.unsplash.com/premium_photo-1682141713992-b54999985c32?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                      }
                      alt={service.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute top-4 right-4 rounded-full bg-white px-2 py-1 text-xs font-bold text-gray-900 shadow-sm">
                      ${service.price}
                    </div>
                  </div>

                  <div className="max-w-xl w-full flex flex-col flex-grow">
                    <div className="mt-4 flex items-center gap-x-4 text-xs">
                      <span className="relative z-10 rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-600">
                        {service.category?.name || "General"}
                      </span>
                      <div className="flex items-center gap-x-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span>4.8 (12 reviews)</span>
                      </div>
                    </div>
                    
                    <div className="group relative mt-3">
                      <h3 className="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 line-clamp-1">
                        <Link to={`/services/${service._id}`}>
                          <span className="absolute inset-0" />
                          {service.name}
                        </Link>
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-x-2 border-t pt-4 w-full mt-auto">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <p className="text-xs text-gray-500">Service Area: Downtown & 5 miles</p>
                    </div>
                  </div>
                </article>
                {/* --- END CARD DESIGN --- */}

              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button 
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white border border-gray-200 shadow-lg rounded-full p-3 text-gray-700 hover:scale-110 transition-all hidden md:flex opacity-0 group-hover/section:opacity-100"
          >
            <ChevronRight size={24} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default FeaturedServices;