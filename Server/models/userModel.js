const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
      trim: true,
      maxLength: [50, "Name cannot expand 50 letters"],
    },
    email: {
      // type: email,
      type: String,
      require: [true, "E-mail id is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "plese provide valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [5, "Password must be atleast 6 letters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "service-provider", "admin"],
      default: user,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
