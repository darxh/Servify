import Hero from "../../features/home/components/Hero";
import CategorySection from "../../features/home/components/CategorySection";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-white">
       
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 text-2xl font-bold text-white">
              Servify
            </Link>
          </div>
          <div className="flex flex-1 justify-end gap-x-6">
            <Link to="/auth/login" className="text-sm font-semibold leading-6 text-white hover:text-gray-300">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link to="/auth/register" className="text-sm font-semibold leading-6 text-white hover:text-gray-300">
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* The Attention Grabber */}
        <Hero />

        {/* The Navigation Map */}
        <CategorySection />
        
        {/* Placeholder for Future Sections */}
        <div className="py-24 text-center">
            <p className="text-gray-500">More sections (Featured Providers, Reviews) coming soon...</p>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-center text-white">
          <p>&copy; 2024 Servify. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;