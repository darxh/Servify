import { Link } from "react-router-dom";
import { useServices } from "../../../hooks/useServices";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";
import { formatINR } from "../../../utils/formatCurrency";

const FeaturedServices = () => {
  const { data: services, isLoading, isError } = useServices({ sort: "newest" }); 

  const featuredServices = services?.slice(0, 3) || []; 

  const getServiceImage = (service) => {
    if (service.images && service.images.length > 0) return service.images[0];
    if (service.image) return service.image;
    return "https://images.unsplash.com/photo-1581578731117-104f8a3d3dfa?auto=format&fit=crop&q=80";
  };

  if (isLoading) return (
     <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
     </div>
  );
  
  if (isError || featuredServices.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Featured Services
          </h2>
          <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">
            Top-rated professionals in your area.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <Link 
              key={service._id} 
              to={`/services/${service._id}`}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-56 bg-gray-200 overflow-hidden shrink-0">
                <img 
                  src={getServiceImage(service)} 
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-gray-900 shadow-sm">
                  {formatINR(service.price)}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-4">
                   <span className="text-xs uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                     {service.category?.name || "General"}
                   </span>
                   <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                     <Star size={12} className="fill-orange-400 text-orange-400" /> 
                     {service.reviews?.length > 0 
                       ? (service.reviews.reduce((acc, rev) => acc + rev.rating, 0) / service.reviews.length).toFixed(1) 
                       : "New"}
                   </div>
                </div>

                <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow">
                  {service.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto text-sm text-gray-500 font-medium">
                   <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="truncate max-w-[120px]">
                        {service.address ? service.address.split(',')[0] : service.provider?.name}
                      </span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-gray-400" />
                      <span>{service.duration} mins</span>
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
           <Link 
             to="/services" 
             className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition-colors"
           >
              View All Services <ArrowRight size={20} />
           </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;