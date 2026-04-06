import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { responseSuccess, responseError } from "../response";
import { Response } from "express";

describe("Response Utility", () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn().mockReturnThis() as any,
    };
  });

  it("should format success response correctly", () => {
    const data = { id: 1 };
    responseSuccess(mockResponse as Response, "Success Message", 200, data);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: "Success Message",
      status: 200,
      data,
    });
  });

  it("should format error response correctly", () => {
    const error = { details: "Some error" };
    responseError(mockResponse as Response, "Error Message", 400, error);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "Error Message",
      status: 400,
      error,
    });
  });
});
