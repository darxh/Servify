require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

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

app.use(helmet());
// app.use(helmet({
//   crossOriginResourcePolicy: { policy: "cross-origin" }
// }));
// app.use(mongoSanitize());
// app.use(mongoSanitize({
//   allowDots: true,
//   replaceWith: '_',
// }));

// Server/server.js
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// app.use("/", testRoutes);

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
