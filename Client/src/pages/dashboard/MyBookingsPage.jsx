import { useMyBookings } from "../../hooks/useMyBookings";
import { useUpdateBooking } from "../../hooks/useUpdateBooking";
import { useAuth } from "../../context/AuthContext";
import { Calendar, MapPin, Clock, CheckCircle, XCircle, CheckCheck } from "lucide-react";  

const MyBookingsPage = () => {
  const { user } = useAuth();
  const { data: bookings, isLoading, isError, error } = useMyBookings();
  
  const updateBookingMutation = useUpdateBooking();

  if (isLoading) {
    return <div>Loading your bookings...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const handleStatusChange = (bookingId, newStatus) => {
    updateBookingMutation.mutate({ bookingId, status: newStatus });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Bookings</h1>

      {bookings?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No bookings</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't booked any services yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {bookings.map((booking) => {
              const isProvider = booking.provider?._id === user?._id;

              return (
                <li key={booking._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-blue-600">
                        {booking.service?.name || "Unknown Service"}
                      </p>
                      
                      <div className="ml-2 flex flex-shrink-0 gap-2 items-center">
                        {/* Status Badge */}
                        <p className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'}`}>
                          {booking.status}
                        </p>

                        {isProvider && booking.status === 'pending' && (
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => handleStatusChange(booking._id, "confirmed")}
                              disabled={updateBookingMutation.isPending}
                              className="text-green-600 hover:text-green-900"
                              title="Accept Booking"
                            >
                              <CheckCircle className="h-6 w-6" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking._id, "cancelled")} 
                              disabled={updateBookingMutation.isPending}
                              className="text-red-600 hover:text-red-900"
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
                             className="ml-2 flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                           >
                             <CheckCheck className="h-4 w-4" />
                             <span>Mark Done</span>
                           </button>
                        )}
                        
                        {/* -------------------- */}

                      </div>
                    </div>
                    
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          {booking.address}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
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
    </div>
  );
};

export default MyBookingsPage;