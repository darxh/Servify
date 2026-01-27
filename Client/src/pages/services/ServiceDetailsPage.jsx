import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useService } from "../../hooks/useService";
import { useAuth } from "../../context/AuthContext";
import BookingModal from "../../features/bookings/components/BookingModal";
import { 
  Star, MapPin, Share2, Heart, Grid, 
  Shield, CheckCircle 
} from "lucide-react";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: service, isLoading, isError } = useService(id);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // --- 1. SMART IMAGE LOGIC ---
  const getServiceImages = () => {
    if (!service) return [];
    if (service.images && service.images.length > 0) return service.images;
    if (service.image) return [service.image];
    return ["https://images.unsplash.com/photo-1581578731117-104f8a3d3dfa?auto=format&fit=crop&q=80"];
  };

  const allImages = getServiceImages();
  // We only display up to 5 images in the main grid
  const displayImages = allImages.slice(0, 5);
  const totalImages = displayImages.length;

  // --- 2. DYNAMIC LAYOUT LOGIC (The Airbnb Magic) ---
  const getImageSpanClass = (index, total) => {
    // 1 Image: Full Screen
    if (total === 1) return "col-span-4 row-span-2";
    
    // 2 Images: Split evenly vertical
    if (total === 2) return "col-span-2 row-span-2";
    
    // 3 Images: 1 Big Left, 2 Stacked Right
    if (total === 3) {
      if (index === 0) return "col-span-2 row-span-2"; // Left Big
      return "col-span-2 row-span-1"; // Right Stacked
    }
    
    // 4 Images: 1 Big Left, 2 Small Top-Right, 1 Wide Bottom-Right
    if (total === 4) {
      if (index === 0) return "col-span-2 row-span-2"; // Left Big
      if (index === 3) return "col-span-2 row-span-1"; // Bottom Right Wide
      return "col-span-1 row-span-1"; // Top Right Smalls
    }
    
    // 5+ Images: Standard Airbnb Grid (1 Big, 4 Small)
    if (index === 0) return "col-span-2 row-span-2"; // Left Big
    return "col-span-1 row-span-1"; // Others Small
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (isError || !service) return (
    <div className="text-center py-20 text-red-500">Error loading service details.</div>
  );

  const isProvider = user?._id === service.provider?._id;

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
              {service.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1 font-semibold text-gray-900">
                <Star className="h-4 w-4 fill-black text-black" />
                <span>4.8</span>
                <span className="text-gray-500 font-normal underline cursor-pointer">(12 reviews)</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1 hover:underline cursor-pointer">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md transition text-sm font-medium underline">
                <Share2 className="h-4 w-4" /> Share
             </button>
             <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md transition text-sm font-medium underline">
                <Heart className="h-4 w-4" /> Save
             </button>
          </div>
        </div>

        {/* --- ADAPTIVE IMAGE GALLERY --- */}
        {/* We use CSS Grid with 4 columns and 2 rows */}
        <div className="relative rounded-xl overflow-hidden shadow-sm mb-12 h-[300px] md:h-[400px] lg:h-[480px]">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-full">
            {displayImages.map((img, index) => (
              <div 
                key={index} 
                className={`relative overflow-hidden cursor-pointer group ${getImageSpanClass(index, totalImages)}`}
              >
                <img 
                  src={img} 
                  alt={`Gallery ${index}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-in-out hover:brightness-95"
                />
              </div>
            ))}
          </div>

          {/* "Show All" Button - Only show if we have more images */}
          <button className="absolute bottom-4 right-4 bg-white border border-gray-900 px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition transform active:scale-95">
              <Grid className="h-4 w-4" /> 
              {allImages.length > 5 ? `Show all ${allImages.length} photos` : "View photos"}
          </button>
        </div>
      </div>

      {/* CONTENT: Left Info & Right Sticky Booking */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT: Details */}
        <div className="lg:col-span-2">
          {/* Provider Bar */}
          <div className="flex justify-between items-center pb-8 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Hosted by {service.provider?.name}</h2>
              <p className="text-gray-500 text-sm">Joined in 2024 • Verified Professional</p>
            </div>
            <div className="h-14 w-14 bg-gray-200 rounded-full overflow-hidden">
               <img 
                 src={`https://ui-avatars.com/api/?name=${service.provider?.name}&background=0D8ABC&color=fff`} 
                 alt="Host"
                 className="w-full h-full object-cover" 
               />
            </div>
          </div>

          {/* Highlights */}
          <div className="py-8 border-b border-gray-200 space-y-6">
             <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-gray-900 mt-1" />
                <div>
                   <h3 className="font-bold text-gray-900">Secure Payment</h3>
                   <p className="text-gray-500 text-sm">Your money is held safely until the service is completed.</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-gray-900 mt-1" />
                <div>
                   <h3 className="font-bold text-gray-900">Verified Professional</h3>
                   <p className="text-gray-500 text-sm">Identity and skills have been verified by Servify.</p>
                </div>
             </div>
          </div>

          {/* Description */}
          <div className="py-8 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About this service</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {service.description}
            </p>
          </div>

          {/* Reviews Preview */}
          <div className="py-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 fill-black" /> 4.8 · 12 Reviews
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[1, 2].map((i) => (
                 <div key={i} className="space-y-3">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden">
                          <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="User" />
                       </div>
                       <div>
                          <p className="font-bold text-sm text-gray-900">John Doe</p>
                          <p className="text-gray-500 text-xs">Oct 2025</p>
                       </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                       "Great experience! Highly recommended."
                    </p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
               <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${service.price}</span>
                    <span className="text-gray-500"> / service</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium">
                     <Star className="h-3 w-3 fill-black text-black" /> 4.8
                  </div>
               </div>

               <div className="border border-gray-400 rounded-lg mb-6 overflow-hidden">
                  <div className="flex border-b border-gray-400">
                     <div className="w-1/2 p-3 border-r border-gray-400">
                        <label className="block text-[10px] font-bold uppercase text-gray-700">Duration</label>
                        <span className="text-sm text-gray-900">{service.duration} mins</span>
                     </div>
                     <div className="w-1/2 p-3">
                        <label className="block text-[10px] font-bold uppercase text-gray-700">Category</label>
                        <span className="text-sm text-gray-900">{service.category?.name}</span>
                     </div>
                  </div>
                  <div className="p-3 bg-gray-50">
                     <label className="block text-[10px] font-bold uppercase text-gray-700">Provider</label>
                     <span className="text-sm text-gray-900">{service.provider?.name}</span>
                  </div>
               </div>

               {isProvider ? (
                <Link
                  to={`/dashboard/services/edit/${service._id}`}
                  className="w-full block text-center bg-gray-900 text-white py-3.5 rounded-lg font-bold hover:bg-black transition"
                >
                  Edit Service
                </Link>
               ) : (
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg transform active:scale-95"
                >
                  Book Now
                </button>
               )}

               <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">You won't be charged yet</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal - CONDITIONALLY RENDERED */}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          serviceId={id}
          price={service.price}
        />
      )}
    </div>
  );
};

export default ServiceDetailsPage;