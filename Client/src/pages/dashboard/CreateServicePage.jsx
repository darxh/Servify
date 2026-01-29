import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { useCreateService } from "../../hooks/useCreateService";
import { 
  UploadCloud, 
  X, 
  Loader2, 
  DollarSign, 
  Clock, 
  AlignLeft,
  ChevronLeft
} from "lucide-react";

const CreateServicePage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const { data: categories = [] } = useCategories();
  const createServiceMutation = useCreateService();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can only upload up to 5 images");
      return;
    }
    setSelectedFiles(files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("duration", data.duration);
    formData.append("category", data.category);
    selectedFiles.forEach((file) => formData.append("images", file));

    createServiceMutation.mutate(formData, {
      onSuccess: () => navigate("/dashboard/services")
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
      
      <div className="mb-10 flex items-center gap-4">
        <button 
           onClick={() => navigate(-1)}
           className="p-2.5 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-200"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Post a New Service</h1>
          <p className="text-gray-500 mt-2 text-lg">Details about your offering.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Service Gallery</label>
              <p className="text-sm text-gray-500 mb-4">
                Upload up to 5 high-quality images to showcase your work.
              </p>
            </div>
            
            <div className={`
              border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200
              ${previews.length > 0 ? "border-gray-300 bg-gray-50/50" : "border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 cursor-pointer"}
            `}>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden" 
                id="image-upload"
              />
              
              <label htmlFor="image-upload" className="cursor-pointer block">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600 ring-4 ring-blue-50">
                  <UploadCloud size={28} />
                </div>
                <span className="text-base font-bold text-gray-900 block">Click to upload</span>
                <span className="text-sm text-gray-500 mt-1 block">SVG, PNG, JPG</span>
              </label>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {previews.map((src, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-white/90 text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900">Service Title</label>
              <input
                {...register("name", { required: "Title is required" })}
                type="text"
                placeholder="e.g. Professional Home Cleaning"
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

            {/* Price & Duration Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Price ($)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    {...register("price", { required: "Price is required", min: 1 })}
                    type="number"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-gray-50/30 focus:bg-white"
                    placeholder="0.00"
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
                    placeholder="60"
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
                  placeholder="Describe your service in detail..."
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
                disabled={createServiceMutation.isPending}
                className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
              >
                {createServiceMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" /> Creating...
                  </>
                ) : (
                  "Publish Service"
                )}
              </button>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};

export default CreateServicePage;