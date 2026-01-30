require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
connectDB();

const PORT = process.env.PORT || 8080;

//middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL
    ],
    credentials: true,
  })
);

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.use("/", testRoutes);

app.use((err, req, res, next) => {
  console.log("--------------------------------");
  console.log("GLOBAL ERROR CAUGHT:");
  console.log(err.stack);
  console.log("Error Details:", JSON.stringify(err, null, 2));
  console.log("--------------------------------");
  res.status(500).json({ message: err.message, error: err });
});

app.listen(PORT, () => {
  console.log(`Server is running at: http://localhost:${PORT}`);
});
