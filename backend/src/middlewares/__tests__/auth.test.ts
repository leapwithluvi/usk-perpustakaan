import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Request, Response, NextFunction } from "express";

jest.mock("@/utils/jwt", () => {
  return {
    __esModule: true,
    extractTokenFromHeader: jest.fn(),
    verifyAccessToken: jest.fn(),
  };
});

jest.mock("@/repositories/session.repository", () => {
  return {
    __esModule: true,
    findSessionById: jest.fn(),
  };
});

import { authMiddleware } from "../auth";
import * as jwtUtils from "@/utils/jwt";
import * as sessionRepo from "@/repositories/session.repository";

describe("Auth Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunctionValue: NextFunction;

  const mockedJwtUtils = jwtUtils as jest.Mocked<typeof jwtUtils>;
  const mockedSessionRepo = sessionRepo as jest.Mocked<typeof sessionRepo>;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn().mockReturnThis() as any,
      locals: {},
    };
    nextFunctionValue = jest.fn() as any;
    jest.clearAllMocks();
  });

  it("should return 401 if token is missing", async () => {
    mockedJwtUtils.extractTokenFromHeader.mockReturnValue(null);

    await authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunctionValue
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "Access token missing",
    });
  });

  it("should return 401 if session is invalid or expired", async () => {
    mockedJwtUtils.extractTokenFromHeader.mockReturnValue("valid-token");
    mockedJwtUtils.verifyAccessToken.mockReturnValue({
      sessionId: "123",
    } as any);
    mockedSessionRepo.findSessionById.mockResolvedValue(null as any);

    await authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunctionValue
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Invalid session",
    });
  });

  it("should proceed to next() and set res.locals if valid", async () => {
    const mockSession = {
      user: { id: "u1" },
      expiresAt: new Date(Date.now() + 10000),
    };

    mockedJwtUtils.extractTokenFromHeader.mockReturnValue("valid-token");
    mockedJwtUtils.verifyAccessToken.mockReturnValue({
      sessionId: "123",
    } as any);
    mockedSessionRepo.findSessionById.mockResolvedValue(mockSession as any);

    await authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunctionValue
    );

    expect(nextFunctionValue).toHaveBeenCalled();
    expect(mockResponse.locals?.user).toEqual(mockSession.user);
    expect(mockResponse.locals?.session).toEqual(mockSession);
  });
});
