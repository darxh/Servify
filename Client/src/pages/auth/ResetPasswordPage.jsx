import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, Loader2, ArrowLeft } from "lucide-react";
import apiClient from "../../lib/axios";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const newPassword = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await apiClient.put(`/auth/reset-password/${token}`, { password: data.password });
      toast.success("Password reset successful!");
      navigate("/auth/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired token.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
        <p className="text-gray-500">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              {...register("password", { 
                required: "Password is required",
                minLength: { value: 6, message: "Must be at least 6 characters" }
              })}
              type="password"
              placeholder="Enter new password"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              {...register("confirmPassword", { 
                required: "Please confirm your password",
                validate: value => value === newPassword || "Passwords do not match"
              })}
              type="password"
              placeholder="Confirm new password"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Save Password"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link to="/auth/login" className="text-sm font-bold text-gray-500 hover:text-black flex items-center justify-center transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;