import { useState } from "react";
import { useMyBookings } from "../../hooks/useMyBookings";
import { useUpdateBooking } from "../../hooks/useUpdateBooking";
import { useCancelBooking } from "../../hooks/useCancelBooking";
import { useAuth } from "../../context/AuthContext";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  CheckCheck, 
  Star, 
  AlertCircle 
} from "lucide-react";
import ReviewModal from "../../features/reviews/components/ReviewModal";

const MyBookingsPage = () => {
  const { user } = useAuth();
  const { data: bookings, isLoading, isError, error } = useMyBookings();
   
  const updateBookingMutation = useUpdateBooking();
  
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  }

  // Provider: Change Status (Confirm, Reject/Cancel, Complete)
  const handleStatusChange = (bookingId, newStatus) => {
    updateBookingMutation.mutate({ bookingId, status: newStatus });
  };

  // User: Cancel Booking
  const handleCancel = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking(bookingId, {
        onSuccess: () => alert("Booking cancelled successfully!"),
        onError: (err) => alert(err.response?.data?.message || "Failed to cancel"),
      });
    }
  };

  const handleRateService = (serviceId) => {
    setSelectedServiceId(serviceId);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {bookings?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No bookings found</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't booked any services yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {bookings.map((booking) => {
              const isProvider = booking.provider?._id === user?._id;
              
              return (
                <li key={booking._id} className="hover:bg-gray-50 transition-colors">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between mb-4">
                      {/* Service Name */}
                      <p className="text-lg font-medium text-blue-600 truncate">
                        {booking.service?.name || "Unknown Service"}
                      </p>
                      
                      {/* Status Badge & Actions */}
                      <div className="flex flex-shrink-0 gap-3 items-center">
                        <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>

                        {/* provider actions*/}
                        {isProvider && booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(booking._id, "confirmed")}
                              disabled={updateBookingMutation.isPending}
                              className="p-1 rounded-full text-green-600 hover:bg-green-100 transition-colors"
                              title="Accept Booking"
                            >
                              <CheckCircle className="h-6 w-6" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking._id, "cancelled")} 
                              disabled={updateBookingMutation.isPending}
                              className="p-1 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                              title="Reject Booking"
                            >
                              <XCircle className="h-6 w-6" />
                            </button>
                          </div>
                        )}

                        {isProvider && booking.status === 'confirmed' && (
                           <button
                             onClick={() => handleStatusChange(booking._id, "completed")}
                             disabled={updateBookingMutation.isPending}
                             className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                           >
                             <CheckCheck className="h-4 w-4" />
                             <span>Mark Done</span>
                           </button>
                        )}

                        {/* user actions */}
                        {/* cancel Booking  */}
                        {!isProvider && (booking.status === 'pending' || booking.status === 'confirmed') && (
                           <button
                             onClick={() => handleCancel(booking._id)}
                             disabled={isCancelling}
                             className="flex items-center gap-1 border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                           >
                             <AlertCircle className="h-4 w-4" />
                             <span>{isCancelling ? "Cancelling..." : "Cancel"}</span>
                           </button>
                        )}

                        {/* Rate Service */}
                        {!isProvider && booking.status === 'completed' && (
                           <button
                             onClick={() => handleRateService(booking.service?._id)}
                             className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors shadow-sm"
                           >
                             <Star className="h-4 w-4 fill-white" />
                             <span>Rate</span>
                           </button>
                        )}
                        
                      </div>
                    </div>
                    
                    {/* Booking Details */}
                    <div className="sm:flex sm:justify-between text-sm text-gray-500">
                      <div className="flex flex-col sm:flex-row sm:gap-6 gap-2">
                        <p className="flex items-center">
                          <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900 mr-1">Date:</span>
                          {new Date(booking.bookingDate).toLocaleDateString(undefined, {
                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </p>
                        <p className="flex items-center">
                          <MapPin className="mr-1.5 h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900 mr-1">Address:</span>
                          {booking.address}
                        </p>
                      </div>
                      
                      <div className="mt-2 sm:mt-0 flex items-center">
                        <p>
                          {isProvider ? "Customer: " : "Provider: "}
                          <span className="font-medium text-gray-900">
                            {isProvider ? booking.user?.name : booking.provider?.name}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        serviceId={selectedServiceId}
      />
    </div>
  );
};

export default MyBookingsPage;