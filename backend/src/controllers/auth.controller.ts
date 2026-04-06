import { NextFunction, Request, Response } from "express";
import {
  register,
  login,
  logout,
  logoutAll,
  refresh,
  me,
} from "@/services/auth.service";
import { responseSuccess } from "@/utils/response";

/**
 * Controller untuk menangani pendaftaran user baru.
 */
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await register(res.locals.parsed.body);
    return responseSuccess(res, "Pendaftaran berhasil", 201, result);
  } catch (error) {
    next(error); // Error diteruskan ke errorHandler middleware
  }
};

/**
 * Controller untuk menangani autentikasi login.
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await login(res.locals.parsed.body, {
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });
    return responseSuccess(res, "Login berhasil", 200, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk menangani logout sesi tertentu.
 */
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await logout(res.locals.session.id);
    return responseSuccess(res, "Berhasil keluar dari akun", 200, null);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk menangani logout massal (di semua perangkat).
 */
export const logoutAllController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await logoutAll(res.locals.user.id);
    return responseSuccess(
      res,
      "Berhasil keluar dari semua sesi di perangkat lain",
      200,
      null
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk pembaharuan Access Token lewat Refresh Token.
 */
export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await refresh(res.locals.parsed.body.refreshToken, {
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });
    return responseSuccess(res, "Token berhasil diperbarui", 200, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mengambil metadata profil user yang login.
 */
export const meController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await me(res.locals.user.id);
    return responseSuccess(res, "Informasi profil dikirim", 200, result);
  } catch (error) {
    next(error);
  }
};
