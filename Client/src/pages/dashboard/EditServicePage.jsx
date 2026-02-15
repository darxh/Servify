import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { useService } from "../../hooks/useService"; //
import { useUpdateService } from "../../hooks/useUpdateService"; //
import { 
  UploadCloud, 
  X, 
  Loader2, 
  IndianRupee,
  Clock, 
  AlignLeft,
  ChevronLeft,
  ImageIcon
} from "lucide-react";

const EditServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Fetch Existing Data
  const { data: service, isLoading: isLoadingService } = useService(id);
  const { data: categories = [] } = useCategories();
  const updateServiceMutation = useUpdateService();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  // Local state for NEW images
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // 2. Pre-fill Form when Service Loads
  useEffect(() => {
    if (service) {
      reset({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category?._id || service.category // Handle populated or ID
      });
    }
  }, [service, reset]);

  // Image Handling (Same as Create Page)
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + (service?.images?.length || 0) > 10) {
      alert("You can't add that many images.");
      return;
    }
    setSelectedFiles(files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeNewImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  // 3. Submit Logic
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("duration", data.duration);
    formData.append("category", data.category);
    
    // Append NEW images only
    selectedFiles.forEach((file) => formData.append("images", file));

    updateServiceMutation.mutate({ serviceId: id, formData }, {
      onSuccess: () => navigate("/dashboard/services")
    });
  };

  if (isLoadingService) return (
    <div className="flex h-screen items-center justify-center">
       <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Loading service details...</p>
       </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="mb-10 flex items-center gap-4">
        <button 
           onClick={() => navigate(-1)}
           className="p-2.5 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-200"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Service</h1>
          <p className="text-gray-500 mt-2 text-lg">Update your service details and pricing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* LEFT COLUMN: Media (Sticky) */}
          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
            
            {/* 1. Current Images Section */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon size={16} /> Current Images
              </label>
              <div className="grid grid-cols-2 gap-3">
                 {service?.images?.length > 0 ? (
                    service.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                        <img src={img} alt="Current" className="w-full h-full object-cover" />
                        {/* Optional: Add Delete Button here later if backend supports it */}
                      </div>
                    ))
                 ) : (
                    <div className="col-span-2 text-sm text-gray-400 italic bg-gray-50 p-4 rounded-xl text-center">
                       No images uploaded yet.
                    </div>
                 )}
              </div>
            </div>

            {/* 2. Upload New Section */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Add New Images</label>
              
              <div className={`
                border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200
                ${previews.length > 0 ? "border-gray-300 bg-gray-50/50" : "border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 cursor-pointer"}
              `}>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden" 
                  id="edit-image-upload"
                />
                
                <label htmlFor="edit-image-upload" className="cursor-pointer block">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-blue-600 ring-4 ring-blue-50">
                    <UploadCloud size={24} />
                  </div>
                  <span className="text-sm font-bold text-gray-900 block">Click to upload</span>
                </label>
              </div>

              {/* Previews of NEW images */}
              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {previews.map((src, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-blue-200 shadow-sm ring-2 ring-blue-500/20">
                      <img src={src} alt="New Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" /> {/* Blue tint for new images */}
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-white/90 text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-white cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Form Fields (Same Pro Style) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900">Service Title</label>
              <input
                {...register("name", { required: "Title is required" })}
                type="text"
                className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-gray-50/30 focus:bg-white"
              />
              {errors.name && <span className="text-red-500 text-xs font-medium">{errors.name.message}</span>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900">Category</label>
              <div className="relative">
                <select
                  {...register("category", { required: "Category is required" })}
                  className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-gray-50/30 focus:bg-white appearance-none"
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Price (₹)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    {...register("price", { required: "Price is required", min: 1 })}
                    type="number"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-gray-50/30 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Duration (mins)</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    {...register("duration", { required: "Duration is required" })}
                    type="number"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-gray-50/30 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900">Description</label>
              <div className="relative">
                <textarea
                  {...register("description", { required: "Description is required" })}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-gray-50/30 focus:bg-white resize-y"
                />
                <AlignLeft className="absolute top-4 right-4 h-5 w-5 text-gray-300 pointer-events-none" />
              </div>
            </div>

            {/* Submit Area */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard/services")}
                className="px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateServiceMutation.isPending}
                className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
              >
                {updateServiceMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};

export default EditServicePage;