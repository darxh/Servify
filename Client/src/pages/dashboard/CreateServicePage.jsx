import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateService } from "../../hooks/useCreateService";
import { useCategories } from "../../hooks/useCategories";
import { Upload, X, Loader2 } from "lucide-react";

const CreateServicePage = () => {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState([]);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const createServiceMutation = useCreateService();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const selectedFiles = watch("images");

  useEffect(() => {
    if (selectedFiles && selectedFiles.length > 0) {
      const newPreviews = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        newPreviews.push(URL.createObjectURL(selectedFiles[i]));
      }
      setPreviews(newPreviews);

      return () => {
        newPreviews.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [selectedFiles]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("duration", data.duration);
    formData.append("category", data.category);

    if (data.images && data.images.length > 0) {
      if (data.images.length > 5) {
        alert("You can only upload up to 5 images");
        return;
      }
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    createServiceMutation.mutate(formData, {
      onSuccess: () => {
        alert("Service created successfully!");
        navigate("/dashboard/services");
      },
      onError: (error) => {
        alert(error.response?.data?.message || "Failed to create service");
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Service</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Service Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            placeholder="e.g. AC Repair"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          {isLoadingCategories ? (
            <p className="text-sm text-gray-500">Loading categories...</p>
          ) : (
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
          )}
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
              {...register("duration", { required: "Duration is required", min: 15 })}
              defaultValue={60}
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
            placeholder="Describe your service..."
          />
        </div>

        {/* --- FIXED FILE UPLOAD WITH PREVIEW --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Images (Max 5)</label>
          
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors relative">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    {...register("images")}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* --- PREVIEW GRID --- */}
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
              {previews.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                    className="h-24 w-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                        setValue("images", null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* -------------------------------------- */}

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={createServiceMutation.isPending}
            className="flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
          >
            {createServiceMutation.isPending ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Uploading...
              </>
            ) : (
              "Create Service"
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateServicePage;