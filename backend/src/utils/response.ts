import { Response } from "express";

export const responseSuccess = <T>(
  res: Response,
  message: string,
  status: number,
  data: T
) => {
  return res.status(status).json({
    success: true,
    message,
    status,
    data,
  });
};

export const responseError = <T>(
  res: Response,
  message: string,
  status: number,
  error: T
) => {
  return res.status(status).json({
    success: false,
    message,
    status,
    error,
  });
};
