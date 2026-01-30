import { Link } from "react-router-dom";
import { useCategories } from "../../../hooks/useCategories";
import { 
  Wrench, 
  Zap, 
  Droplets, 
  PaintBucket, 
  Truck, 
  Home, 
  Smartphone, 
  Briefcase, 
  LayoutGrid,
  Monitor,
  Scissors
} from "lucide-react";

const CategorySection = () => {
  // Fetching categories from backend
  const { data: categories = [], isLoading } = useCategories();

  // Helper: Auto-select icon based on category name keyword
  const getCategoryDetails = (name) => {
    const lower = name.toLowerCase();
    
    if (lower.includes("repair") || lower.includes("ac")) return { icon: Wrench, color: "text-blue-600", bg: "bg-blue-100" };
    if (lower.includes("electric")) return { icon: Zap, color: "text-amber-600", bg: "bg-amber-100" };
    if (lower.includes("plumb")) return { icon: Droplets, color: "text-cyan-600", bg: "bg-cyan-100" };
    if (lower.includes("paint")) return { icon: PaintBucket, color: "text-pink-600", bg: "bg-pink-100" };
    if (lower.includes("mov")) return { icon: Truck, color: "text-purple-600", bg: "bg-purple-100" };
    if (lower.includes("clean")) return { icon: Home, color: "text-green-600", bg: "bg-green-100" };
    if (lower.includes("tech") || lower.includes("computer")) return { icon: Monitor, color: "text-indigo-600", bg: "bg-indigo-100" };
    if (lower.includes("beauty")) return { icon: Scissors, color: "text-rose-600", bg: "bg-rose-100" };
    
    // Default Fallback
    return { icon: LayoutGrid, color: "text-gray-600", bg: "bg-gray-100" };
  };

  const displayCategories = categories.slice(0, 6);

  if (isLoading) return (
    <div className="bg-white py-24 sm:py-32">
       <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse"></div>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explore Categories
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Select a category to find expert professionals near you.
          </p>
        </div>

        {/* The Grid System */}
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:max-w-none lg:grid-cols-6 lg:gap-x-8">
          {displayCategories.map((cat) => {
            const { icon: Icon, color, bg } = getCategoryDetails(cat.name);
            
            return (
              <Link
                key={cat._id}
                to={`/services?category=${cat._id}`} // [Fix] Use ID for filtering
                className="group relative flex flex-col items-center justify-center rounded-3xl bg-white border border-gray-100 p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-blue-100 hover:shadow-blue-900/5"
              >
                {/* Icon Circle */}
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${bg} transition-transform group-hover:scale-110 duration-300 mb-4`}>
                  <Icon className={`h-8 w-8 ${color}`} />
                </div>
                
                {/* Category Name */}
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
          
          {/* Empty State Fallback */}
          {displayCategories.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400 italic bg-gray-50 rounded-xl">
               No categories found. Please add them in your database.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CategorySection;