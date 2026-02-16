import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useService } from "../../hooks/useService";
import { useAuth } from "../../context/AuthContext";
import BookingModal from "../../features/bookings/components/BookingModal";
import { formatINR } from "../../utils/formatCurrency";
import {
  Star, MapPin, Share2, Heart, Grid,
  Shield, CheckCircle, User, ArrowLeft 
} from "lucide-react";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate(); 

  const { data: service, isLoading, isError } = useService(id);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const getServiceImages = () => {
    if (!service) return [];
    if (service.images && service.images.length > 0) return service.images;
    if (service.image) return [service.image];
    return ["https://images.unsplash.com/photo-1581578731117-104f8a3d3dfa?auto=format&fit=crop&q=80"];
  };

  const allImages = getServiceImages();
  const displayImages = allImages.slice(0, 5);
  const totalImages = displayImages.length;

  const reviews = service?.reviews || [];
  const totalReviews = reviews.length;

  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
    : "New";

  const getImageSpanClass = (index, total) => {
    if (total === 1) return "col-span-4 row-span-2";
    if (total === 2) return "col-span-2 row-span-2";
    if (total === 3) return index === 0 ? "col-span-2 row-span-2" : "col-span-2 row-span-1";
    if (total === 4) {
      if (index === 0) return "col-span-2 row-span-2";
      if (index === 3) return "col-span-2 row-span-1";
      return "col-span-1 row-span-1";
    }
    return index === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1";
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
    });
  };

  const platformFee = 50;

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-8">
         
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              {service.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-black text-black" />
                <span className="text-black font-semibold">{averageRating}</span>
                {totalReviews > 0 && (
                  <span className="underline cursor-pointer">
                    · {totalReviews} reviews
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="text-gray-800 underline">
                {service.category?.name}
              </span>
               
              {service.address && (
                <>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-semibold text-gray-800 underline decoration-gray-300 hover:text-blue-600 transition-colors underline-offset-4 cursor-pointer"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{service.address}</span>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition text-sm font-semibold underline decoration-gray-300 underline-offset-4">
              <Share2 className="h-4 w-4" /> Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition text-sm font-semibold underline decoration-gray-300 underline-offset-4">
              <Heart className="h-4 w-4" /> Save
            </button>
          </div> */}
        </div>

        {/* Image Gallery */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm mb-12 h-[300px] md:h-[450px]">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-full">
            {displayImages.map((img, index) => (
              <div
                key={index}
                className={`relative overflow-hidden cursor-pointer group bg-gray-200 ${getImageSpanClass(index, totalImages)}`}
              >
                <img
                  src={img}
                  alt={`Gallery ${index}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out hover:brightness-95"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>

          <button className="absolute bottom-6 right-6 bg-white border border-gray-900/10 px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-gray-50 flex items-center gap-2 transition transform active:scale-95">
            <Grid className="h-4 w-4" />
            {allImages.length > 5 ? `Show all ${allImages.length} photos` : "Show all photos"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Details & Reviews */}
        <div className="lg:col-span-2">
          
          {/* Provider Info Bar  */}
          <div className="flex justify-between items-start pb-8 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Hosted by {service.provider?.name}
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                Verified Professional · {service.duration} min duration
              </p>
              {service.provider?.bio && (
                <p className="text-gray-600 text-sm italic max-w-md line-clamp-2">
                  "{service.provider.bio}"
                </p>
              )}
            </div>

            <div className="h-14 w-14 rounded-full overflow-hidden border border-gray-100 bg-gray-100 shrink-0">
              {service.provider?.profileImage ? (
                <img
                  src={service.provider.profileImage}
                  alt={service.provider.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${service.provider?.name}&background=000&color=fff&font-size=0.35`}
                  alt="Host"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Highlights */}
          <div className="py-8 border-b border-gray-200 space-y-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-gray-900 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Your money is held safely until the service is completed to your satisfaction.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-gray-900 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Verified Professional</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Identity and skills have been verified by the Servify team.</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="py-8 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About this service</h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
              {service.description}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="py-10">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <Star className="h-5 w-5 fill-black" />
              {averageRating} · {totalReviews} Reviews
            </h3>

            {totalReviews === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                <p className="text-gray-500">No reviews yet. Be the first to book and review!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {reviews.map((review) => (
                  <div key={review._id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-200">
                        {review.user?.profileImage ? (
                          <img
                            src={review.user.profileImage}
                            alt={review.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">
                          {review.user?.name || "Anonymous"}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex text-black">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < review.rating ? "fill-black" : "fill-gray-200 text-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Card*/}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <div className="bg-white rounded-2xl shadow-[0_6px_16px_rgba(0,0,0,0.12)] border border-gray-200 p-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-2xl font-bold text-gray-900">{formatINR(service.price)}</span>
                  <span className="text-gray-500"> / service</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                  <Star className="h-3 w-3 fill-black text-black" /> {averageRating}
                </div>
              </div>

              {/* Info Grid */}
              <div className="border border-gray-300 rounded-xl mb-6 overflow-hidden">
                <div className="flex border-b border-gray-300">
                  <div className="w-1/2 p-3 border-r border-gray-300">
                    <label className="block text-[10px] font-extrabold uppercase text-gray-700 tracking-wider">Duration</label>
                    <span className="text-sm text-gray-900">{service.duration} mins</span>
                  </div>
                  <div className="w-1/2 p-3">
                    <label className="block text-[10px] font-extrabold uppercase text-gray-700 tracking-wider">Type</label>
                    <span className="text-sm text-gray-900 truncate block">{service.category?.name}</span>
                  </div>
                </div>
                <div className={`p-3 bg-gray-50/50 ${service.address ? 'border-b border-gray-300' : ''}`}>
                  <label className="block text-[10px] font-extrabold uppercase text-gray-700 tracking-wider">Provider</label>
                  <span className="text-sm text-gray-900">{service.provider?.name}</span>
                </div>
                {service.address && (
                  <div className="p-3 bg-white">
                    <label className="block text-[10px] font-extrabold uppercase text-gray-700 tracking-wider flex items-center gap-1">
                      <MapPin size={10} /> Location
                    </label>
                    <span className="text-sm text-gray-900 truncate block" title={service.address}>
                      {service.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Buttons */}
              {isProvider ? (
                <Link
                  to={`/dashboard/services/edit/${service._id}`}
                  className="w-full block text-center bg-black text-white py-3.5 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg"
                >
                  Edit Service
                </Link>
              ) : (
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg transform active:scale-[0.98]"
                >
                  Book Now
                </button>
              )}

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">You won't be charged yet</p>
              </div>

              {/* <div className="mt-6 space-y-3 pt-6 border-t border-gray-100 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="underline decoration-gray-300">Service Fee</span>
                  <span>{formatINR(service.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline decoration-gray-300">Platform Fee</span>
                  <span>{formatINR(platformFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatINR(service.price + platformFee)}</span>
                </div>
              </div> */}
              <div className="mt-6 space-y-3 pt-6 border-t border-gray-100 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="underline decoration-gray-300">Service Fee</span>
                  <span>{formatINR(service.price)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="underline decoration-gray-300">Platform Fee</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">Waived</span>
                    <span className="line-through text-gray-400">{formatINR(platformFee)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end font-bold text-gray-900 pt-4 border-t border-gray-200">
                  <div className="flex flex-col">
                     <span className="text-base">Total</span>
                     <span className="text-xs font-normal text-gray-500 italic mt-0.5">(Pay provider directly)</span>
                  </div>
                  <span className="text-lg">{formatINR(service.price)}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

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