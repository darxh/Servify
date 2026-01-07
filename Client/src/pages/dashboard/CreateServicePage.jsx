import { useForm } from "react-hook-form";
import { useCreateService } from "../../hooks/useCreateService";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CreateServicePage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { mutate, isPending } = useCreateService();

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      price: Number(data.price),
      category: "6924acf77e718f55fb0ac328" 
    };
    
    mutate(formattedData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow border border-gray-200">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/dashboard/services" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Service</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Service Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Service Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            placeholder="e.g., Home Cleaning Standard"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input
            type="number"
            {...register("price", { required: "Price is required", min: 1 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            placeholder="0.00"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            placeholder="Describe your service in detail..."
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            {...register("image")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            placeholder="https://..."
            defaultValue="https://images.unsplash.com/photo-1581578731117-104f2a863a30?auto=format&fit=crop&w=1000&q=80"
          />
          <p className="text-xs text-gray-500 mt-1">We will add file upload later. Use a link for now.</p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create Service"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateServicePage;