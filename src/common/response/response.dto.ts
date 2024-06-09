/**
 * Response class
 */
export class Response<T> {
  /**
   * code. 0 for success, others for error
   */
  code: number;
  /**
   * Message
   */
  message: string;
  /**
   * Data
   */
  data?: T | null;
  private static readonly SUCCESS_CODE = 0;
  private static readonly SUCCESS_MESSAGE = 'success';
  private static readonly ERROR_MESSAGE = 'error';
  private static readonly ERROR_CODE = 1;

  constructor(code?: number, message?: string, data?: T | null) {
    this.code = code || Response.SUCCESS_CODE;
    this.message =
      message ||
      (this.code === Response.SUCCESS_CODE
        ? Response.SUCCESS_MESSAGE
        : Response.ERROR_MESSAGE);
    this.data = data;
  }

  /**
   * Success response
   * @param data
   * @param message
   * @param code
   */
  static success<T>(
    data?: T | null,
    message?: string,
    code?: number,
  ): Response<T> {
    return new Response(
      code || this.SUCCESS_CODE,
      message || this.SUCCESS_MESSAGE,
      data,
    );
  }

  /**
   * Error response
   * @param message
   * @param code
   */
  static error<T>(message?: string, code?: number): Response<T> {
    return new Response(
      code || this.ERROR_CODE,
      message || this.ERROR_MESSAGE,
      null,
    );
  }
}
