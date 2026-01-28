import { useAuth } from "../../context/AuthContext";
import { useMyBookings } from "../../hooks/useMyBookings";
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Wallet,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data: bookings = [], isLoading, isError } = useMyBookings();

  const totalBookings = bookings.length;
  
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const activeBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  const totalAmount = bookings.reduce((sum, booking) => sum + (booking.price || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active / Pending",
      value: activeBookings,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Completed",
      value: completedBookings,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      label: user?.role === 'provider' ? "Total Revenue" : "Total Spent",
      value: `$${totalAmount}`,
      icon: user?.role === 'provider' ? TrendingUp : Wallet,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  if (isLoading) return (
    <div className="flex h-96 items-center justify-center">
       <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your services today.
          </p>
        </div>
        <div className="flex gap-3">
           {/* Quick Action Buttons */}
           <Link to="/services" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm">
              Find Services
           </Link>
           {user?.role === 'provider' && (
             <Link to="/dashboard/services/new" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm">
                + New Service
             </Link>
           )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              {/* Add percentage growth here (later) */}
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <Link to="/dashboard/bookings" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
            View All
          </Link>
        </div>
        
        <div className="divide-y divide-gray-100">
          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                <AlertCircle className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">No activity yet</h3>
              <p className="mt-1 text-sm text-gray-500">Book your first service to get started!</p>
            </div>
          ) : (
            bookings.slice(0, 5).map((booking) => (
              <div key={booking._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    {booking.service?.images?.[0] || booking.service?.image ? (
                        <img 
                          src={booking.service?.images?.[0] || booking.service?.image} 
                          alt="Service" 
                          className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                           <LayoutDashboard className="h-5 w-5 text-gray-400" />
                        </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 line-clamp-1">
                      {booking.service?.name || "Service Unavailable"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.date || booking.createdAt).toLocaleDateString()} • ${booking.price}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                      {booking.status}
                   </span>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;