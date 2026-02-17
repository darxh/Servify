import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { useService } from "../../hooks/useService"; 
import { useUpdateService } from "../../hooks/useUpdateService"; 
import { 
  UploadCloud, 
  X, 
  Loader2, 
  IndianRupee,
  Clock, 
  AlignLeft,
  ChevronLeft,
  ImageIcon,
  MapPin,
  Navigation
} from "lucide-react";
import toast from "react-hot-toast";

const EditServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: service, isLoading: isLoadingService } = useService(id);
  const { data: categories = [] } = useCategories();
  const updateServiceMutation = useUpdateService();

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState({ type: "", text: "" });
  
  const currentAddress = watch("address");
  const [verifiedAddress, setVerifiedAddress] = useState(""); 
 
  useEffect(() => {
    if (service) {
      reset({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category?._id || service.category,
        address: service.address || "" 
      });

      if (service.location && service.location.coordinates && service.location.coordinates.length === 2) {
        setCoordinates({
          lng: service.location.coordinates[0], 
          lat: service.location.coordinates[1]
        }); 
        setVerifiedAddress(service.address || "");
        setLocationMessage({ type: "success", text: "Saved location loaded." });
      }
    }
  }, [service, reset]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + (service?.images?.length || 0) > 5) {
      toast.error("You can't add more than 5 images.");
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


  // geocoading part
  const verifyAddress = async () => {
    if (!currentAddress) {
      setLocationMessage({ type: "error", text: "Please enter an address first." });
      return;
    }
    setLocationLoading(true);
    setLocationMessage({ type: "", text: "" });

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(currentAddress)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        setCoordinates({ lat: data[0].lat, lng: data[0].lon });
        setVerifiedAddress(currentAddress);
        setLocationMessage({ type: "success", text: "Location verified successfully!" });
      } else {
        setCoordinates({ lat: null, lng: null });
        setVerifiedAddress("");
        setLocationMessage({ type: "error", text: "Could not find coordinates for this address." });
      }
    } catch (error) {
      setLocationMessage({ type: "error", text: "Failed to verify address." });
    } finally {
      setLocationLoading(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage({ type: "error", text: "Geolocation is not supported by your browser." });
      return;
    }
    setLocationLoading(true);
    setLocationMessage({ type: "", text: "" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.display_name) {
            setValue("address", data.display_name); 
            setVerifiedAddress(data.display_name);
            setLocationMessage({ type: "success", text: "Location updated to current position!" });
          }
        } catch (error) {
          setLocationMessage({ type: "error", text: "Got coordinates, but failed to fetch street name." });
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        setLocationMessage({ type: "error", text: "Please allow location permissions." });
      }
    );
  };


  const onSubmit = (data) => {
    if (!coordinates.lat || !coordinates.lng || currentAddress !== verifiedAddress) {
      setLocationMessage({ type: "error", text: "Address changed! You must click Verify before saving." });
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("duration", data.duration);
    formData.append("category", data.category);
    
    formData.append("address", data.address);
    formData.append("lat", coordinates.lat);
    formData.append("lng", coordinates.lng);
    
    selectedFiles.forEach((file) => formData.append("images", file));

    updateServiceMutation.mutate({ serviceId: id, formData }, {
      onSuccess: () => {
        toast.success("Service updated successfully!");
        navigate("/dashboard/services");
      },
      onError: () => {
        toast.error("Failed to update service.");
      }
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
          
          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-24">
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon size={16} /> Current Images
              </label>
              <div className="grid grid-cols-2 gap-3">
                 {service?.images?.length > 0 ? (
                    service.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                        <img src={img} alt="Current" className="w-full h-full object-cover" />
                      </div>
                    ))
                 ) : (
                    <div className="col-span-2 text-sm text-gray-400 italic bg-gray-50 p-4 rounded-xl text-center">
                       No images uploaded yet.
                    </div>
                 )}
              </div>
            </div>

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

              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {previews.map((src, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-blue-200 shadow-sm ring-2 ring-blue-500/20">
                      <img src={src} alt="New Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" /> 
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

          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900">Service Title</label>
              <input
                {...register("name", { required: "Title is required" })}
                type="text"
                className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-gray-50/30 focus:bg-white"
              />
              {errors.name && <span className="text-red-500 text-xs font-medium">{errors.name.message}</span>}
            </div>

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

            {/* Location Section */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900">Service Location</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    {...register("address", { required: "Address is required" })}
                    type="text"
                    placeholder="e.g. MG Road, Bengaluru"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-gray-50/30 focus:bg-white"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={verifyAddress}
                  disabled={locationLoading}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors whitespace-nowrap"
                >
                  Verify
                </button>
                
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={locationLoading}
                  className="px-4 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Navigation size={18} />
                  Detect
                </button>
              </div>
              
              {locationLoading && <p className="text-sm text-blue-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Processing location...</p>}
              {locationMessage.text && (
                <p className={`text-sm font-medium ${locationMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {locationMessage.text}
                </p>
              )}
              {errors.address && <span className="text-red-500 text-xs font-medium">{errors.address.message}</span>}
            </div>

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