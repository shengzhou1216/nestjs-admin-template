import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    this.logger.error(exception.stack);

    const errorResponse = exception.getResponse();
    let message: unknown;
    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (errorResponse instanceof Object && 'message' in errorResponse) {
      message = errorResponse['message'];
    }
    response.status(status).json({
      code: status,
      message,
    });
  }

  private getValidationErrors(validationError: ValidationError) {
    const errors = {};
    for (const property in validationError.constraints) {
      errors[property] = validationError.constraints[property];
    }
    return errors;
  }
}
