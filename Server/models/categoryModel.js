const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxLength: [50, "Name cannot exceed 50 letters"],
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().split(" ").join("-");
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
