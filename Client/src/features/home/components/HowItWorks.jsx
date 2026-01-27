import { Search, CalendarCheck, Smile } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-blue-600" />,
      title: "1. Search & Filter",
      description: "Browse thousands of verified professionals by category, price, or rating to find your perfect match."
    },
    {
      icon: <CalendarCheck className="h-10 w-10 text-blue-600" />,
      title: "2. Book & Pay",
      description: "Select a convenient time slot and pay securely through our platform. No hidden fees."
    },
    {
      icon: <Smile className="h-10 w-10 text-blue-600" />,
      title: "3. Relax & Enjoy",
      description: "Sit back while the professional handles the work. Release payment only when you're satisfied."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">How Servify Works</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Get your tasks done in three simple steps. We make hiring professionals easy and safe.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 text-center group"
            >
              <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;