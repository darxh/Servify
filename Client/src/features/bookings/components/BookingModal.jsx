import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCreateBooking } from "../../../hooks/useCreateBooking";
import { formatINR } from "../../../utils/formatCurrency";
import { X, Calendar, Clock, MapPin, Phone, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const BookingModal = ({ isOpen, onClose, serviceId, price }) => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const createBookingMutation = useCreateBooking();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setPhoneError("");

    if (!user?.phoneNumber && (!phoneNumber || phoneNumber.trim().length < 8)) {
      setPhoneError("A valid mobile number is required so the provider can contact you.");
      return;
    }

    const bookingDate = new Date(`${date}T${time}`).toISOString();

    const bookingPayload = {
      serviceId,
      bookingDate,
      address,
      phoneNumber: !user?.phoneNumber ? phoneNumber : undefined
    };

    createBookingMutation.mutate(bookingPayload, {
      onSuccess: () => {
        if (!user?.phoneNumber && phoneNumber) {
          updateUser({ ...user, phoneNumber });
        }

        toast.success("Booking confirmed successfully!");
        onClose();
        navigate("/dashboard/bookings");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to create booking.");
        setPhoneError(error.response?.data?.message || "Failed to create booking.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Book Service</h2>
            <p className="text-sm text-gray-500 mt-0.5">Fill in the details to confirm your request.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-700">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Service Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Where do you need the service?"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white text-sm"
              />
            </div>
          </div>

          {!user?.phoneNumber && (
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl space-y-3">
              <div className="flex items-start gap-2 text-blue-800">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-xs font-medium leading-relaxed">
                  We need your mobile number so the provider can coordinate with you. It will be saved securely to your profile.
                </p>
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-blue-400 pointer-events-none" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-sm"
                />
              </div>
              {phoneError && <p className="text-red-500 text-xs font-bold">{phoneError}</p>}
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-700">Total Price</span>
              <span className="text-xl font-black text-gray-900">{formatINR(price)}</span>
            </div>

            <button
              type="submit"
              disabled={createBookingMutation.isPending}
              className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {createBookingMutation.isPending ? (
                <><Loader2 className="animate-spin" size={18} /> Processing...</>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookingModal;