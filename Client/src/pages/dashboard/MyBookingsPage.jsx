import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMyBookings } from "../../hooks/useMyBookings";
import { useCancelBooking } from "../../hooks/useCancelBooking";
import { useUpdateBooking } from "../../hooks/useUpdateBooking";
import ReviewModal from "../../features/reviews/components/ReviewModal";
import {
  Calendar, MapPin, Clock, User, CheckCircle, XCircle,
  MessageSquare, Briefcase, ShoppingBag, Phone, AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatINR } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

const MyBookingsPage = () => {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useMyBookings();
  const cancelBookingMutation = useCancelBooking();
  const updateBookingMutation = useUpdateBooking();

  const [activeTab, setActiveTab] = useState("customer");
  const [reviewModal, setReviewModal] = useState({ isOpen: false, serviceId: null });

  const customerBookings = bookings.filter(b => b.user?._id === user?._id);
  const providerBookings = bookings.filter(b => b.provider?._id === user?._id);

  const handleCancel = (id) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-sm w-full bg-white shadow-2xl rounded-3xl pointer-events-auto flex flex-col p-6 gap-5 border border-gray-100`}
      >
        <div className="flex items-start gap-4">
          <div className="bg-red-50 p-3 rounded-full shrink-0 border border-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div className="pt-1">
            <h3 className="font-bold text-gray-900 text-lg">Cancel Booking?</h3>
            <p className="text-sm text-gray-500 mt-1">The provider will be notified. Are you sure you want to proceed?</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-xl transition-colors"
          >
            Keep it
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              cancelBookingMutation.mutate(id, {
                onSuccess: () => toast.success("Booking cancelled successfully!"),
                onError: () => toast.error("Failed to cancel booking.")
              });
            }}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-red-200"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    ), { 
      duration: Infinity, 
      id: `cancel-${id}` 
    });
  };

  const handleStatusUpdate = (id, newStatus) => {
    updateBookingMutation.mutate({ id, status: newStatus }, {
      onSuccess: () => {
        if (newStatus === "confirmed") toast.success("Job accepted successfully!");
        if (newStatus === "completed") toast.success("Job marked as completed!");
        if (newStatus === "cancelled") toast.success("Job rejected.");
      },
      onError: () => toast.error("Failed to update status.")
    });
  };

  const getServiceImage = (service) => {
    if (!service) return "https://images.unsplash.com/photo-1581578731117-104f8a3d3dfa?auto=format&fit=crop&q=80";
    if (service.images && service.images.length > 0) return service.images[0];
    if (service.image) return service.image;
    return "https://images.unsplash.com/photo-1581578731117-104f8a3d3dfa?auto=format&fit=crop&q=80";
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${styles[status] || "bg-gray-100"}`}>
        {status}
      </span>
    );
  };

  if (isLoading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings & Jobs</h1>
          <p className="text-gray-500 mt-1">Track your service history and upcoming jobs.</p>
        </div>
      </div>

      {user?.role === 'provider' ? (
        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
          <button
            onClick={() => setActiveTab("customer")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "customer"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <ShoppingBag size={18} />
            Booked by Me ({customerBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("provider")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "provider"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <Briefcase size={18} />
            Incoming Jobs ({providerBookings.length})
          </button>
        </div>
      ) : null}

      <div className="space-y-4">

        {(activeTab === "customer" ? customerBookings : providerBookings).length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              {activeTab === 'customer' ? <ShoppingBag className="h-6 w-6 text-gray-400" /> : <Briefcase className="h-6 w-6 text-gray-400" />}
            </div>
            <h3 className="text-sm font-bold text-gray-900">No {activeTab === 'customer' ? 'bookings' : 'jobs'} found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'customer' ? "You haven't booked any services yet." : "No one has booked your services yet."}
            </p>
          </div>
        ) : (
          (activeTab === "customer" ? customerBookings : providerBookings).map((booking) => {

            const displayPrice = booking.price || booking.service?.price;
            const displayAddress = booking.service?.address || booking.address;

            const targetPhone = activeTab === 'customer' ? booking.provider?.phoneNumber : booking.user?.phoneNumber;

            return (
              <div
                key={booking._id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row gap-6">

                  {/* Image Thumbnail */}
                  <div className="w-full md:w-40 h-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                    <img
                      src={getServiceImage(booking.service)}
                      alt={booking.service?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 md:hidden">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                            {booking.service?.name || "Unknown Service"}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            {activeTab === 'customer' ? (
                              <>Provided by <span className="font-semibold text-gray-900">{booking.provider?.name}</span></>
                            ) : (
                              <>Customer: <span className="font-semibold text-blue-600 flex items-center gap-1"><User size={14} /> {booking.user?.name}</span></>
                            )}
                          </p>
                        </div>
                        <div className="hidden md:block">
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-4 text-sm text-gray-600">

                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400 shrink-0" />
                          <span className="font-medium">
                            {new Date(booking.bookingDate).toLocaleDateString(undefined, {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                            <span className="text-gray-400 mx-1">at</span>
                            {new Date(booking.bookingDate).toLocaleTimeString([], {
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-400 shrink-0" />
                          <span>{booking.service?.duration || 60} mins</span>
                        </div>

                        <div className="flex items-center gap-2 sm:col-span-2">
                          <MapPin size={16} className="text-gray-400 shrink-0" />
                          {displayAddress ? (
                            <a
                              href={`https://maps.google.com/?q=...{encodeURIComponent(displayAddress)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate max-w-[300px] text-gray-700 hover:text-blue-600 hover:underline transition-colors"
                              title={displayAddress}
                            >
                              {displayAddress}
                            </a>
                          ) : (
                            <span className="italic text-gray-400">Location not provided</span>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">

                      <span className="font-bold text-xl text-gray-900">{formatINR(displayPrice)}</span>

                      <div className="flex gap-2">

                        {targetPhone && ["pending", "confirmed"].includes(booking.status) && (
                          <a
                            href={`tel:${targetPhone}`}
                            className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg hover:bg-blue-100 transition flex items-center gap-2 border border-blue-200"
                          >
                            <Phone size={16} />
                            {activeTab === 'customer' ? 'Call Provider' : 'Call Customer'}
                          </a>
                        )}

                        {activeTab === 'customer' && (
                          <>
                            {["pending", "confirmed"].includes(booking.status) && (
                              <button
                                onClick={() => handleCancel(booking._id)}
                                disabled={cancelBookingMutation.isPending}
                                className="px-4 py-2 border border-gray-300 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition"
                              >
                                Cancel
                              </button>
                            )}

                            {booking.status === "completed" && !booking.isReviewed && (
                              <button
                                onClick={() => setReviewModal({ isOpen: true, serviceId: booking.service?._id })}
                                className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-black transition flex items-center gap-2"
                              >
                                <MessageSquare size={16} /> Leave Review
                              </button>
                            )}

                            {booking.isReviewed && (
                              <span className="text-sm text-green-600 font-bold flex items-center gap-1 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                                <CheckCircle size={14} /> Reviewed
                              </span>
                            )}
                          </>
                        )}

                        {activeTab === 'provider' && (
                          <>
                            {booking.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                                  className="px-4 py-2 border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 flex items-center gap-2"
                                >
                                  <XCircle size={16} /> Reject
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                  <CheckCircle size={16} /> Accept Job
                                </button>
                              </>
                            )}
                            {booking.status === "confirmed" && (
                              <button
                                onClick={() => handleStatusUpdate(booking._id, "completed")}
                                className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 flex items-center gap-2"
                              >
                                <CheckCircle size={16} /> Mark Completed
                              </button>
                            )}
                          </>
                        )}

                        <Link
                          to={`/services/${booking.service?._id}`}
                          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )
          })
        )}
      </div>

      {reviewModal.isOpen && (
        <ReviewModal
          isOpen={reviewModal.isOpen}
          onClose={() => setReviewModal({ isOpen: false, serviceId: null })}
          serviceId={reviewModal.serviceId}
        />
      )}
    </div>
  );
};

export default MyBookingsPage;