import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useService } from "../../hooks/useService";
import { useUpdateService } from "../../hooks/useUpdateService";
import { useCategories } from "../../hooks/useCategories";
import { ArrowLeft, Save, Upload, X, Loader2 } from "lucide-react";

const EditServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  
  const { data: service, isLoading: isLoadingService } = useService(id);
  const { data: categories } = useCategories();

  const updateMutation = useUpdateService();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  const selectedFile = watch("image");

  useEffect(() => {
    if (service) {
      setValue("name", service.name);
      setValue("price", service.price);
      setValue("description", service.description);
      setValue("duration", service.duration || 60);
      setValue("category", service.category?._id || service.category);
      
      if (service.image) {
        setPreview(service.image);
      }
    }
  }, [service, setValue]);

  useEffect(() => {
    if (selectedFile && selectedFile.length > 0) {
      const file = selectedFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Cleanup memory
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("duration", data.duration);
    formData.append("category", data.category);

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    updateMutation.mutate(
      { 
        id, 
        data: formData
      },
      {
        onSuccess: () => {
          alert("Service updated successfully!");
          navigate("/dashboard/services");
        },
        onError: (error) => {
          alert(error.response?.data?.message || "Failed to update service");
        }
      }
    );
  };

  if (isLoadingService) return (
    <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/></div>
  );

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

        {/* Image Upload & Preview Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Image</label>
          
          <div className="flex items-start gap-6">
             {/* Preview Box */}
            <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {preview ? (
                <img src={preview} alt="Service preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-xs">No Image</span>
                </div>
              )}
            </div>

            {/* Upload Box */}
            <div className="flex-1">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> new image</p>
                    <p className="text-xs text-gray-500">JPG, PNG or WEBP</p>
                </div>
                <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    {...register("image")}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
          >
            {updateMutation.isPending ? (
                <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving...
                </>
            ) : (
                <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditServicePage;