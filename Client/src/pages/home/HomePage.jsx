import Hero from "../../features/home/components/Hero";
import CategorySection from "../../features/home/components/CategorySection";
import FeaturedServices from "../../features/home/components/FeaturedServices";
import HowItWorks from "../../features/home/components/HowItWorks";
import Footer from "../../features/home/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, LogIn, UserPlus, LogOut } from "lucide-react";

const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload(); 
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
       
      <header className="absolute inset-x-0 top-0 z-50">
        
        <nav className="max-w-7xl mx-auto flex items-center justify-between p-4 lg:px-8" aria-label="Global">
          
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow-md">
                Servify
              </span>
            </Link>
          </div>

          <div className="flex flex-1 justify-end gap-x-3 md:gap-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5
                  p-2.5 md:px-6 md:py-2.5 text-sm" 
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all backdrop-blur-sm border border-white/10
                  p-2.5 md:px-4 md:py-2.5 text-sm"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="hidden md:flex items-center gap-2 text-sm font-semibold leading-6 text-white hover:text-blue-200 transition-colors px-4 py-2"
                >
                  <LogIn size={18} />
                  Log in
                </Link>
                <Link
                  to="/auth/register"
                  className="flex items-center gap-2 bg-white text-blue-900 hover:bg-gray-100 px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg transform hover:-translate-y-0.5"
                >
                  <UserPlus size={18} />
                  <span className="md:hidden">Join</span>
                  <span className="hidden md:inline">Sign up</span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <Hero />
        <CategorySection />
        <HowItWorks />
        <FeaturedServices />
        
        <div className="bg-gradient-to-br from-blue-900 to-gray-900 py-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
           
           <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to simplify your life?
            </h2>
            <p className="text-blue-100 mb-10 text-lg max-w-2xl mx-auto">
              Join thousands of people who trust Servify for their daily needs. 
              Secure, fast, and professional.
            </p>
            {!isAuthenticated && (
              <Link 
                to="/auth/register"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-500 transition-all shadow-xl hover:shadow-blue-600/20"
              >
                Get Started for Free
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;