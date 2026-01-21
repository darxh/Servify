import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate(`/services?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/services");
    }
  };

  return (
    <div className="relative isolate overflow-hidden bg-slate-900 py-16 sm:py-24 lg:py-32">
      <div className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
        <div
          className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Find the perfect professional for your home
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            From house cleaning to appliance repair, we connect you with trusted experts in minutes.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-10 flex items-center justify-center gap-x-6">
            <div className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border-0 bg-white/10 py-3 pl-10 pr-3 text-white shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                placeholder="What service do you need today?"
              />
            </div>
            <button 
              type="submit"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;