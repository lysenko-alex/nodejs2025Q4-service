import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppException } from '../errors/custom-exceptions';
import { LoggingService } from '../logging/logging.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorCode: string | undefined;

    if (exception instanceof AppException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as {
        message?: string | string[];
        errorCode?: string;
      };
      message = exceptionResponse.message || message;
      errorCode = exceptionResponse.errorCode;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        const responseObj = exceptionResponse as {
          message?: string | string[];
        };
        message = responseObj.message || JSON.stringify(exceptionResponse);
      }
    }

    const errorMessage = Array.isArray(message) ? message.join(', ') : message;
    const errorDetails = {
      statusCode: status,
      message: errorMessage,
      path: request.url,
      method: request.method,
      errorCode,
      stack: exception instanceof Error ? exception.stack : undefined,
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.loggingService.error(
        `Error: ${JSON.stringify(errorDetails)}`,
        'HttpExceptionFilter',
      );
    } else {
      this.loggingService.warn(
        `Error: ${JSON.stringify(errorDetails)}`,
        'HttpExceptionFilter',
      );
    }

    const responseBody: {
      statusCode: number;
      message: string;
      error?: string;
      errorCode?: string;
    } = {
      statusCode: status,
      message: errorMessage,
    };

    if (errorCode) {
      responseBody.errorCode = errorCode;
    } else {
      responseBody.error =
        exception instanceof HttpException
          ? exception.name
          : 'Internal Server Error';
    }

    response.status(status).json(responseBody);
  }
}
