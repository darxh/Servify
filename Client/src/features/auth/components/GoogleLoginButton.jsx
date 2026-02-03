// import { GoogleLogin } from "@react-oauth/google";
// import { useAuth } from "../../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const GoogleLoginButton = () => {
//     const { loginWithGoogle } = useAuth();
//     const navigate = useNavigate();

//     const handleSuccess = async (credentialResponse) => {
//         try {
//             await loginWithGoogle(credentialResponse.credential);

//             toast.success("Successfully logged in with Google!");

//         } catch (error) {
//             console.error("Google Auth Error:", error);
//             toast.error(error.response?.data?.message || "Google Login Failed");
//         }
//     };

//     const handleError = () => {
//         toast.error("Google Sign-In failed. Please try again.");
//     };

//     return (
//         <div className="w-full flex justify-center mt-4">
//             <GoogleLogin
//                 onSuccess={handleSuccess}
//                 onError={handleError}
//                 theme="filled_black"
//                 shape="pill"
//                 size="large"
//                 width="100%"
//                 text="continue_with"
//             />
//         </div>
//     );
// };

// export default GoogleLoginButton;

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const GoogleLoginButton = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        console.log("--------------------------------------");
        console.log("🕵️‍♂️ FRONTEND SPY: Google Popup Finished");
        console.log("Did we get a token?", credentialResponse.credential ? "YES" : "NO");
        console.log("Token:", credentialResponse.credential);

        try {
            console.log("🕵️‍♂️ FRONTEND SPY: Sending token to Backend now...");
            await loginWithGoogle(credentialResponse.credential);

            console.log("🕵️‍♂️ FRONTEND SPY: Backend said Success!");
            toast.success("Successfully logged in with Google!");
            navigate("/");

        } catch (error) {
            console.log("--------------------------------------");
            console.error("🕵️‍♂️ FRONTEND ERROR SPY:", error);
            console.log("Error Message:", error.response?.data?.message);
            console.log("--------------------------------------");
            toast.error(error.response?.data?.message || "Google Login Failed");
        }
    };

    const handleError = () => {
        console.error("🕵️‍♂️ FRONTEND SPY: Google Popup Failed (User closed it or Network issue)");
        toast.error("Google Sign-In failed. Please try again.");
    };

    return (
        <div className="w-full flex justify-center mt-4">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="filled_black"
                shape="pill"
                size="large"
                width="100%"
                text="continue_with"
            />
        </div>
    );
};

export default GoogleLoginButton;