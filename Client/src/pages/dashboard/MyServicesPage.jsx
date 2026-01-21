import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useServices } from "../../hooks/useServices";
import { useDeleteService } from "../../hooks/useDeleteService";
import { useAuth } from "../../context/AuthContext";

const MyServicesPage = () => {
  const { user } = useAuth();
  // Fetch all services. In a real app, you might want a specific endpoint like /services/my-services
  // to avoid filtering on the client, but this works for now.
  const { data: services, isLoading } = useServices();
  const { mutate: deleteService } = useDeleteService();

  const myServices =
    services?.filter((service) => {
      const providerId = service.provider?._id || service.provider;
      return providerId === user?._id;
    }) || [];

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this service? This cannot be undone."
      )
    ) {
      deleteService(id);
    }
  };

  if (isLoading) return <div>Loading your services...</div>;

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">
            My Services
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage the services you offer.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            to="/dashboard/services/new"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="inline-block h-4 w-4 mr-1" />
            Add Service
          </Link>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {myServices.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">
                  You haven't posted any services yet.
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {myServices.map((service) => (
                    <tr key={service._id}>
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center">
                          <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                            <img
                              className="h-full w-full object-cover"
                              src={
                                service.image ||
                                "https://plus.unsplash.com/premium_photo-1682141713992-b54999985c32?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                              }
                              alt="deafult image"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {service.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        ${service.price}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {service.category?.name || "General"}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        
                        <Link
                          to={`/dashboard/services/edit/${service._id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4 inline-block"
                          title="Edit Service"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(service._id)}
                          className="text-red-600 hover:text-red-900 inline-block"
                          title="Delete Service"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyServicesPage;