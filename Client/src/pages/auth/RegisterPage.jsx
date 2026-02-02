import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../lib/axios";
import { Loader2, Mail, Lock, User, ArrowLeft, Briefcase } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      role: "user"
    }
  });

  const currentRole = watch("role");

  const onSubmit = async (data) => {
    try {
      // Register (Backend sends email)
      await apiClient.post("/auth/register", data);
      
      // Success Popup
      toast.success("Account created! Please check your email to verify.", {
        duration: 5000,
        position: "top-center",
      });
      
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
      
    } catch (error) {
      setError("root", { 
        message: error.response?.data?.message || "Registration failed. Try again." 
      });
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <Toaster />
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        
        {/* Header */}
        <div className="mb-6">
           <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-6 transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Back to Home
           </Link>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Join Servify</h1>
           <p className="text-gray-500 mt-2 text-sm">Create an account to get started.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Role Selector Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setValue("role", "user")}
              className={`flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                currentRole === "user" 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <User size={16} /> I want to Hire
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "provider")}
              className={`flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
                currentRole === "provider" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Briefcase size={16} /> I want to Work
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                {...register("name", { required: "Name is required" })}
                type="text" 
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50/50 focus:bg-white"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                })}
                type="email" 
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50/50 focus:bg-white"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Must be at least 6 characters" }
                })}
                type="password" 
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-gray-50/50 focus:bg-white"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
          </div>

          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium text-center">
              {errors.root.message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Create Account"}
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/auth/login" className="font-bold text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;