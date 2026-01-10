// import { useMyBookings } from "../../hooks/useMyBookings";
// import { Calendar, MapPin, Clock } from "lucide-react";

// const MyBookingsPage = () => {
//   //  Using hoook
//   const { data: bookings, isLoading, isError, error } = useMyBookings();

//   if (isLoading) {
//     return <div>Loading your bookings...</div>;
//   }

//   if (isError) {
//     return <div className="text-red-500">Error: {error.message}</div>;
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Bookings</h1>

//       {/* Empty State   */}
//       {bookings?.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
//           <Calendar className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-semibold text-gray-900">No bookings</h3>
//           <p className="mt-1 text-sm text-gray-500">You haven't booked any services yet.</p>
//         </div>
//       ) : (
//         /*  The List of Bookings */
//         <div className="bg-white shadow overflow-hidden sm:rounded-md">
//           <ul role="list" className="divide-y divide-gray-200">
//             {bookings.map((booking) => (
//               <li key={booking._id}>
//                 <div className="px-4 py-4 sm:px-6">
//                   <div className="flex items-center justify-between">
//                     <p className="truncate text-sm font-medium text-blue-600">
//                       {booking.service?.name || "Unknown Service"}
//                     </p>
//                     <div className="ml-2 flex flex-shrink-0">
//                       <p className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
//                         ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
//                           booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
//                           'bg-gray-100 text-gray-800'}`}>
//                         {booking.status}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="mt-2 sm:flex sm:justify-between">
//                     <div className="sm:flex">
//                       <p className="flex items-center text-sm text-gray-500">
//                         <Clock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
//                         {new Date(booking.bookingDate).toLocaleDateString()}
//                       </p>
//                       <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
//                         <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
//                         {booking.address}
//                       </p>
//                     </div>
//                     <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
//                       <p>
//                         Provider: <span className="font-medium text-gray-900">{booking.provider?.name}</span>
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBookingsPage;

import { useMyBookings } from "../../hooks/useMyBookings";
import { useUpdateBooking } from "../../hooks/useUpdateBooking"; // Import the new hook
import { useAuth } from "../../context/AuthContext"; // Import auth to check who is logged in
import { Calendar, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";

const MyBookingsPage = () => {
  const { user } = useAuth(); // Get current logged-in user
  const { data: bookings, isLoading, isError, error } = useMyBookings();
  
  // Initialize our update mutation
  const updateBookingMutation = useUpdateBooking();

  if (isLoading) {
    return <div>Loading your bookings...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  // Handler for buttons
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
              // Check if the current logged-in user is the provider for this booking
              const isProvider = booking.provider?._id === user?._id;

              return (
                <li key={booking._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-blue-600">
                        {booking.service?.name || "Unknown Service"}
                      </p>
                      
                      <div className="ml-2 flex flex-shrink-0 gap-2">
                        {/* Status Badge */}
                        <p className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {booking.status}
                        </p>

                        {/* ACTION BUTTONS: Only show if User is Provider AND Status is Pending */}
                        {isProvider && booking.status === 'pending' && (
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => handleStatusChange(booking._id, "confirmed")}
                              disabled={updateBookingMutation.isPending}
                              className="text-green-600 hover:text-green-900"
                              title="Accept Booking"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking._id, "cancelled")} 
                              disabled={updateBookingMutation.isPending}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Booking"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </div>
                        )}
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
                        {/* If I am the provider, show me the Customer Name. If I am the customer, show me Provider Name */}
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