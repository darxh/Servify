import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useService } from "../../hooks/useService";
import { useUpdateService } from "../../hooks/useUpdateService";
import { useCategories } from "../../hooks/useCategories";
import { ArrowLeft, Save } from "lucide-react";

const EditServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: service, isLoading: isLoadingService } = useService(id);
  
  const { data: categories } = useCategories();

  const updateMutation = useUpdateService();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (service) {
      setValue("name", service.name);
      setValue("price", service.price);
      setValue("description", service.description);
      setValue("duration", service.duration || 60);
      setValue("category", service.category?._id || service.category);
    }
  }, [service, setValue]);

  const onSubmit = (data) => {
    updateMutation.mutate(
      { 
        id, 
        data: { ...data, price: Number(data.price) } 
      },
      {
        onSuccess: () => {
          alert("Service updated successfully!");
          navigate("/dashboard/services");
        }
      }
    );
  };

  if (isLoadingService) return <div>Loading service details...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow border border-gray-200">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/dashboard/services" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Service Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Service Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 bg-white"
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              {...register("price", { required: "Price is required", min: 1 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (mins)</label>
            <input
              type="number"
              {...register("duration")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditServicePage;