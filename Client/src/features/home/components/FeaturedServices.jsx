import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useServices } from "../../../hooks/useServices";

const FeaturedServices = () => { 
  const { data: services, isLoading, isError, error } = useServices();
 
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
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Top Rated Services
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Highly recommended professionals near you.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {services.slice(0, 3).map((service) => (
            <article key={service._id} className="flex flex-col items-start justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
               
              <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={service.image || "https://plus.unsplash.com/premium_photo-1682141713992-b54999985c32?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                  alt={service.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute top-4 right-4 rounded-full bg-white px-2 py-1 text-xs font-bold text-gray-900 shadow-sm">
                  ${service.price}
                </div>
              </div>

              <div className="max-w-xl">
                <div className="mt-4 flex items-center gap-x-4 text-xs">
                  <span className="relative z-10 rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-600">
                  {service.category.name}
                  </span>
                  <div className="flex items-center gap-x-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span>4.8 (12 reviews)</span>
                  </div>
                </div>
                
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link to={`/services/${service._id}`}>
                      <span className="absolute inset-0" />
                      {service.name}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-x-2 border-t pt-4 w-full">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <p className="text-xs text-gray-500">Service Area: Downtown & 5 miles</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedServices;