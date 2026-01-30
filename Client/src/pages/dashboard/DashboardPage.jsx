import { useAuth } from "../../context/AuthContext";
import { useMyBookings } from "../../hooks/useMyBookings";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Briefcase,
  ShoppingBag
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useMyBookings();

  const isProvider = user?.role === 'provider';

  const myBookings = bookings.filter(b =>
    isProvider ? b.provider?._id === user?._id : b.user?._id === user?._id
  );

  const activeJobs = myBookings.filter(b => ["pending", "confirmed"].includes(b.status)).length;
  const completedJobs = myBookings.filter(b => b.status === "completed").length;

  const totalMoney = myBookings
    .filter(b => b.status === "completed")
    .reduce((acc, curr) => acc + (curr.price || 0), 0);

  const recentActivity = myBookings.slice(0, 3);

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.name.split(" ")[0]}! Here's what's happening.
          </p>
        </div>
        <Link
          to="/services"
          className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Find New Services <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${isProvider ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>
              <TrendingUp size={24} />
            </div>
            {isProvider && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>}
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">
            {isProvider ? "Total Earnings" : "Total Spent"}
          </p>
          <h3 className="text-3xl font-bold text-gray-900">${totalMoney}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Active Jobs</p>
          <h3 className="text-3xl font-bold text-gray-900">{activeJobs}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <CheckCircle size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Completed</p>
          <h3 className="text-3xl font-bold text-gray-900">{completedJobs}</h3>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900">Recent Activity</h3>
            <Link to="/dashboard/bookings" className="text-sm font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No activity yet. Book a service to get started!
              </div>
            ) : (
              recentActivity.map((item) => (
                <div key={item._id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                      {isProvider ? <Briefcase size={20} /> : <ShoppingBag size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.service?.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(item.bookingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider
                    ${item.status === 'completed' ? 'bg-green-50 text-green-700' :
                      item.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}
                  `}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="font-bold text-xl mb-2">
              {isProvider ? "Boost your Earnings" : "Need help today?"}
            </h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              {isProvider
                ? "Optimize your profile and get more bookings by updating your service details."
                : "Find verified professionals for cleaning, repair, and more in minutes."}
            </p>

            <Link
              to={isProvider ? "/dashboard/services" : "/services"}
              className="inline-block bg-white text-blue-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg"
            >
              {isProvider ? "Manage Services" : "Explore Services"}
            </Link>
          </div>

          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;