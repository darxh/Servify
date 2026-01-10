import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useCreateBooking } from "../../../hooks/useCreateBooking";

const BookingModal = ({ serviceId, serviceName, price, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useCreateBooking();

  const onSubmit = (data) => {
    mutate({
      serviceId,
      bookingDate: data.bookingDate,
      address: data.address,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Book Service</h2>
        <p className="text-sm text-gray-500 mb-6">
          You are booking{" "}
          <span className="font-semibold text-blue-600">{serviceName}</span> for{" "}
          <span className="font-semibold">${price}</span>.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              {...register("bookingDate", { required: "Date is required" })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.bookingDate && (
              <span className="text-xs text-red-500">
                {errors.bookingDate.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Address
            </label>
            <textarea
              rows={3}
              placeholder="123 Main St, Apt 4B..."
              {...register("address", { required: "Address is required" })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.address && (
              <span className="text-xs text-red-500">
                {errors.address.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
          >
            {isPending ? "Confirming..." : `Confirm Booking ($${price})`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
