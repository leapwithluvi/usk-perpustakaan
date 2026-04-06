import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { requestLogger } from "@/middlewares/requestLogger";
import router from "@/routers/routes";
// import { rateLimiter } from "@/middlewares/rateLimiter";
import hpp from "hpp";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";

const app = express();

/**
 * Konfigurasi agar folder 'uploads' bisa diakses secara publik lewat URL.
 * Contoh: http://localhost:3000/uploads/file.png
 */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Logger
app.use(requestLogger);

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiter
// app.use(rateLimiter);

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Routes
app.use("/api", router);

// Not Found Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

export default app;
