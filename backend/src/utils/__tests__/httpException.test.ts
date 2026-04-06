import { HttpException } from "../httpException";

describe("HttpException", () => {
  it("should create an instance of HttpException with status code and message", () => {
    const statusCode = 404;
    const message = "Not Found";
    const error = new HttpException(statusCode, message);

    expect(error).toBeInstanceOf(HttpException);
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);
    expect(error.name).toBe("HttpException");
  });

  it("should include optional errors data", () => {
    const statusCode = 400;
    const message = "Validation Failed";
    const errors = { email: "Invalid email" };
    const error = new HttpException(statusCode, message, errors);

    expect(error.errors).toEqual(errors);
  });
});
