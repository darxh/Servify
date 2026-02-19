const rateLimit = require("express-rate-limit");

// Limiter for Auth Routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        message: "Too many attempts from this IP, please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Global Limiter for General API Routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: "Too many requests from this IP, please try again later.",
    },
});

module.exports = { authLimiter, apiLimiter };