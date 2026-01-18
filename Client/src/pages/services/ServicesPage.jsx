import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useServices } from "../../hooks/useServices";
import ServiceFilter from "../../features/services/components/ServiceFilter";
import { MapPin, Clock, ArrowRight } from "lucide-react";

const ServicesPage = () => {
  // Setup State for Filters
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [filters, setFilters] = useState({
    keyword: "",
    category: initialCategory,
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });

  // Fetch Data using the Hook
  const { data: services, isLoading, isError } = useServices(filters);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Services</h1>
          <p className="mt-2 text-gray-600">Find the best professionals for your needs.</p>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <ServiceFilter filters={filters} setFilters={setFilters} />
        </div>

        {/* Results Section */}
        {isLoading ? (
          <div className="text-center py-20">Loading services...</div>
        ) : isError ? (
          <div className="text-center text-red-500 py-20">Failed to load services.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services?.map((service) => (
                <div key={service._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                  {/* Image Placeholder */}
                  <div className="h-48 bg-gray-200 w-full object-cover flex items-center justify-center text-gray-400">
                    <span className="text-sm">Image Coming Soon</span>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                         <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-2">
                          {service.category?.name || "Service"}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      </div>
                      <p className="text-lg font-bold text-blue-600">${service.price}</p>
                    </div>

                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{service.description}</p>

                    <div className="mt-4 flex items-center text-sm text-gray-500 gap-4">
                      <div className="flex items-center">
                        <Clock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        {service.duration} mins
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        Provider: {service.provider?.name}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-5 py-3">
                    <Link
                      to={`/services/${service._id}`}
                      className="flex items-center justify-center w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results State */}
            {services?.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-lg font-medium text-gray-900">No services found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;