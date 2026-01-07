import { useParams, Link } from "react-router-dom";
import { useService } from "../../hooks/useService";
import { MapPin, Star, ArrowLeft } from "lucide-react";

const ServiceDetailsPage = () => {
  // Get the ID from the URL
  const { id } = useParams(); 
  
  // Fetch the Data
  const { data: service, isLoading, isError, error } = useService(id);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white">
        <p className="text-red-500">Error loading service details.</p>
        <p className="text-sm text-gray-400">{error.message}</p>
        <Link to="/" className="mt-4 text-blue-600 hover:underline">Go Home</Link>
      </div>
    );
  }

  // Success State (Render the UI)
  return (
    <div className="bg-white">
      {/* Navbar Placeholder (Back Button) */}
      <header className="border-b bg-white p-4">
        <div className="mx-auto max-w-7xl">
            <Link to="/" className="flex w-fit items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
          
          {/* Left Column: Image Gallery */}
          <div>
            <div className="overflow-hidden rounded-3xl bg-gray-100 shadow-lg ring-1 ring-gray-900/10">
              
              <img
                src={service.image || "https://images.unsplash.com/photo-1581578731117-104f2a863a30?auto=format&fit=crop&w=1000&q=80"}
                alt={service.name}
                className="h-[400px] w-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Details & Booking */}
          <div className="flex flex-col justify-start">
            {/* Category Badge */}
            <span className="mb-2 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {service.category?.name || "Service"}
            </span>
            
            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{service.name}</h1>
            
            {/* Ratings & Location */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold text-gray-900">4.8</span>
                <span className="text-gray-500">(124 reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin className="h-5 w-5" />
                <span>Downtown Area</span>
              </div>
            </div>

            {/* Description */}
            <p className="mt-6 text-lg leading-8 text-gray-600">{service.description}</p>

            {/* Price & Action Box */}
            <div className="mt-10 rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-900/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Estimated Price</p>
                  <p className="text-3xl font-bold text-gray-900">${service.price}</p>
                </div>
                <button 
                  className="rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                  onClick={() => alert("Booking functionality coming soon!")}
                >
                  Book Now
                </button>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                * Final price may vary based on complexity.
              </p>
            </div>
            
            {/* Provider Info (Mini Profile) */}
            <div className="mt-8 border-t border-gray-200 pt-8">
               <h3 className="text-sm font-medium text-gray-900">Provided by</h3>
               <div className="mt-4 flex items-center gap-4">
                 <div className="h-12 w-12 rounded-full bg-gray-300"></div> 
                 <div>
                    <p className="font-semibold text-gray-900">{service.provider?.name || "Expert Provider"}</p>
                    <p className="text-sm text-gray-500">Verified Professional</p>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetailsPage;