export class HttpException extends Error {
  statusCode: number;
  errors?: any;

  constructor(statusCode: number, message: string, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "HttpException";

    Error.captureStackTrace(this, this.constructor);
  }
}
