import jwt from "jsonwebtoken";
import { JWTPayload, TokenPair } from "@/types/util.type";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const APP_NAME = process.env.APP_NAME!;
const APP_URL = process.env.APP_URL!;

if (!JWT_SECRET || !JWT_REFRESH_SECRET || !APP_NAME || !APP_URL) {
  throw new Error(
    "JWT_SECRET, JWT_REFRESH_SECRET, APP_NAME, and APP_URL environment variables are required"
  );
}

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN as any,
    issuer: APP_NAME,
    audience: APP_URL,
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN as any,
    issuer: APP_NAME,
    audience: APP_URL,
  });
};

export const generateTokenPair = (payload: JWTPayload): TokenPair => ({
  accessToken: generateAccessToken(payload),
  refreshToken: generateRefreshToken(payload),
});

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET, {
    issuer: APP_NAME,
    audience: APP_URL,
  }) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET, {
    issuer: APP_NAME,
    audience: APP_URL,
  }) as JWTPayload;
};

export const extractTokenFromHeader = (
  authHeader: string | undefined
): string | null => {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return null;
  }

  return parts[1];
};
