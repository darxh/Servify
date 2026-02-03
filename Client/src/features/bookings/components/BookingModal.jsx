import { useForm } from "react-hook-form";
import { X, Clock, Calendar } from "lucide-react";
import { useCreateBooking } from "../../../hooks/useCreateBooking";
import { formatINR } from "../../../utils/formatCurrency";

const BookingModal = ({ serviceId, serviceName, price, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useCreateBooking();

  const onSubmit = (data) => {
    const combinedDateTime = new Date(`${data.bookingDate}T${data.bookingTime}`);
    
    mutate({
      serviceId,
      bookingDate: combinedDateTime.toISOString(),
      address: data.address,
    }, {
      onSuccess: () => {
        onClose(); 
        alert("Booking Confirmed! 🎉");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">Book Service</h2>
        <p className="text-sm text-gray-500 mb-8">
          Complete your booking for <span className="font-bold text-blue-600">{serviceName}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            {/* date input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]} // Disable past dates
                  {...register("bookingDate", { required: "Date is required" })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-700"
                />
              </div>
              {errors.bookingDate && <p className="text-red-500 text-xs mt-1 font-bold">{errors.bookingDate.message}</p>}
            </div>

            {/* time input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <input
                  type="time"
                  {...register("bookingTime", { required: "Time is required" })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-700"
                />
              </div>
              {errors.bookingTime && <p className="text-red-500 text-xs mt-1 font-bold">{errors.bookingTime.message}</p>}
            </div>
          </div>

          {/* address input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Service Address
            </label>
            <textarea
              rows={3}
              placeholder="123 Main St, Apt 4B, New York, NY..."
              {...register("address", { required: "Address is required" })}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-gray-700 resize-none"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1 font-bold">{errors.address.message}</p>}
          </div>

          {/* total price and buttons */}
          <div className="pt-4 border-t border-gray-100 mt-6">
            <div className="flex justify-between items-center mb-6">
               <span className="text-gray-500 font-medium">Total Price</span>
               <span className="text-2xl font-bold text-gray-900">{formatINR(price)}</span>
            </div>
            
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? "Processing..." : "Confirm & Pay"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookingModal;