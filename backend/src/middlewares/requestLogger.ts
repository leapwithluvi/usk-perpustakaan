import { Request, Response } from "express";
import pinoHttp from "pino-http";
import { logger } from "@/config/logger";
import crypto from "crypto";

export const requestLogger = pinoHttp({
  logger,

  genReqId: (req: Request) => {
    return req.headers["x-request-id"] || crypto.randomUUID();
  },

  customLogLevel: (_req: Request, res: Response, err) => {
    if (err) return "error";
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req: Request, res: Response) => {
    return `${req.method} ${req.url} completed with status code ${res.statusCode}`;
  },
  customErrorMessage: (req: Request, res: Response) => {
    return `Request error: ${req.method} ${req.url} failed with status code ${res.statusCode}`;
  },
});
