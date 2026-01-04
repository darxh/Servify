import { Wrench, Zap, Droplet, Paintbrush, Truck, Home } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { id: 1, name: "AC Repair", icon: Wrench, color: "text-blue-600", bg: "bg-blue-100" },
  { id: 2, name: "Electrical", icon: Zap, color: "text-yellow-600", bg: "bg-yellow-100" },
  { id: 3, name: "Plumbing", icon: Droplet, color: "text-cyan-600", bg: "bg-cyan-100" },
  { id: 4, name: "Painting", icon: Paintbrush, color: "text-pink-600", bg: "bg-pink-100" },
  { id: 5, name: "Moving", icon: Truck, color: "text-purple-600", bg: "bg-purple-100" },
  { id: 6, name: "Cleaning", icon: Home, color: "text-green-600", bg: "bg-green-100" },
];

const CategorySection = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explore Categories
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Select a category to find expert professionals near you.
          </p>
        </div>

        {/* The Grid System */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-8 sm:mt-20 sm:grid-cols-3 lg:max-w-none lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/services?category=${category.name}`}
              className="group relative flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-8 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg ring-1 ring-gray-200"
            >
              {/* Icon Circle */}
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${category.bg} transition-colors`}>
                <category.icon className={`h-8 w-8 ${category.color}`} />
              </div>
              
              {/* Category Name */}
              <h3 className="mt-4 text-base font-semibold leading-7 text-gray-900 group-hover:text-blue-600">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;