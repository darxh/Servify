const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/categoryModel");

// 1. Load env variables
dotenv.config();

// 2. Connect to Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🌱 DB Connected for Seeding..."))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// 3. The Master List of Categories
const rawCategories = [
  { 
    name: "Plumbing", 
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1000&auto=format&fit=crop" 
  },
  { 
    name: "Cleaning", 
    image: "https://images.unsplash.com/photo-1581578731117-104f2a863a30?q=80&w=1000&auto=format&fit=crop" 
  },
  { 
    name: "Electrical", 
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop" 
  },
  { 
    name: "Painting", 
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop" 
  },
  { 
    name: "Moving", 
    image: "https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?q=80&w=1000&auto=format&fit=crop" 
  },
  { 
    name: "Landscaping", 
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000&auto=format&fit=crop" 
  },
  { 
    name: "Carpentry", 
    image: "https://images.unsplash.com/photo-1611021061285-19a87d55f147?q=80&w=1000&auto=format&fit=crop" 
  },
  { 
    name: "Appliance Repair", 
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop" 
  }
];

const importData = async () => {
  try {
    // A. Clean up old data
    await Category.deleteMany();
    console.log("🗑️  Old Categories Removed!");

    // B. Manually generate slugs (Since insertMany skips the pre-save hook)
    const categoriesWithSlugs = rawCategories.map((cat) => ({
      ...cat,
      slug: cat.name.toLowerCase().split(" ").join("-"), // Manually creating slug
    }));

    // C. Insert
    await Category.insertMany(categoriesWithSlugs);
    console.log("✅ All Categories Added Successfully!");

    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();