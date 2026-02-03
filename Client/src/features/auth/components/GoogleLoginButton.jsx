import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const GoogleLoginButton = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            await loginWithGoogle(credentialResponse.credential);
            toast.success("Successfully logged in with Google!");
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Google Login Failed");
        }
    };

    const handleError = () => {
        toast.error("Google Sign-In failed. Please try again.");
    };

    return (
        <div className="w-full mt-6 flex flex-col items-center">
            <div className="relative w-full mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
            </div>

            <div className="w-full transition-transform active:scale-[0.98]">
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    theme="outline"
                    shape="pill"
                    size="large"
                    width="100%"
                    text="continue_with"
                    logo_alignment="center"
                />
            </div>
        </div>
    );
};

export default GoogleLoginButton;