import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // Default: 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || "100"), // Default: 100 requests per window
  message: {
    success: false,
    message: "Too many requests, please try again later",
    error: {
      statusCode: 429,
      name: "TooManyRequestsError",
    },
  },
});
