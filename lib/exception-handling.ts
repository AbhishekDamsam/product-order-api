//Custom HttpException class to modify the errors occured in entire app
export class HttpException extends Error {
  httpStatusCode: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.httpStatusCode = status;
    this.message = message;
  }
}