import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, MoreVertical, Briefcase } from "lucide-react";
import { useServices } from "../../hooks/useServices";
import { useDeleteService } from "../../hooks/useDeleteService";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { formatINR } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

const MyServicesPage = () => {
  const { user } = useAuth();
  const { data: services = [], isLoading } = useServices();
  const { mutate: deleteService } = useDeleteService();

  const myServices = services.filter((service) => {
    const providerId = service.provider?._id || service.provider;
    return providerId === user?._id;
  });

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-sm w-full bg-white shadow-2xl rounded-3xl pointer-events-auto flex flex-col p-6 gap-5 border border-gray-100`}
      >
        <div className="flex items-start gap-4">
          <div className="bg-red-50 p-3 rounded-full shrink-0 border border-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <div className="pt-1">
            <h3 className="font-bold text-gray-900 text-lg">Delete Service?</h3>
            <p className="text-sm text-gray-500 mt-1">This action cannot be undone. Are you sure you want to proceed?</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteService(id, {
                onSuccess: () => toast.success("Service deleted successfully!"),
                onError: () => toast.error("Failed to delete service.")
              });
            }}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-red-200"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ), { 
      id: `delete-${id}`, 
      duration: Infinity 
    });
  };

  const getServiceImage = (service) => {
    if (!service) return "https://images.unsplash.com/photo-1581578731117-104f8a3d3dfa?auto=format&fit=crop&q=80";
    if (service.images && service.images.length > 0) return service.images[0];
    if (service.image) return service.image;
    return "https://images.unsplash.com/photo-1581578731117-104f8a3d3dfa?auto=format&fit=crop&q=80";
  };

  if (isLoading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-500 mt-1">Manage the services you offer to clients.</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {/*  "Add New Service" Button */}
        <Link
          to="/dashboard/services/new"
          className="group flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-blue-500 hover:bg-blue-50/50 transition-all min-h-[300px] cursor-pointer"
        >
          <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mb-4 text-gray-400">
            <Plus size={28} />
          </div>
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600">Post New Service</h3>
          <p className="text-sm text-center text-gray-500 mt-1 px-4">Create a new offering to start earning.</p>
        </Link>

        {/* Service Cards */}
        {myServices.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full group"
          >

            {/* Image Area */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img
                src={getServiceImage(service)}
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Category Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                {service.category?.name || "Service"}
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-bold shadow-sm">
                {formatINR(service.price)}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-gray-900 line-clamp-1 text-lg mb-1" title={service.name}>
                {service.name}
              </h3>

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mt-1 mb-4">
                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">
                  Active
                </span>
                <span>•</span>
                <span>{service.duration} mins</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <Link
                  to={`/dashboard/services/edit/${service._id}`}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 transition border border-gray-200"
                >
                  <Pencil size={14} /> Edit
                </Link>

                <button
                  onClick={() => handleDelete(service._id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-white text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition border border-gray-200"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default MyServicesPage;