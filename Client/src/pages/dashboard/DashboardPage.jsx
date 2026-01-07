import { useAuth } from "../../context/AuthContext";
import { Wallet, CalendarClock, ShieldCheck } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth(); // Get the logged-in user data

  const stats = [
    { name: 'Total Bookings', value: '0', icon: CalendarClock, color: "text-blue-600", bg: "bg-blue-100" },
    { name: 'Wallet Balance', value: '$0.00', icon: Wallet, color: "text-green-600", bg: "bg-green-100" },
    { name: 'Account Status', value: 'Active', icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div>
      {/* Welcome Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome back, {user?.name || "User"}! 👋
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here is what is happening with your account today.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                Role: {user?.role?.toUpperCase()}
            </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.value}</dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State / Call to Action */}
      <div className="mt-10 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <CalendarClock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No recent activity</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by exploring services or updating your profile.</p>
      </div>
    </div>
  );
};

export default DashboardPage;