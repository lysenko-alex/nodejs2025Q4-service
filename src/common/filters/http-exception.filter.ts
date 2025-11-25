import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppException } from '../errors/custom-exceptions';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorCode: string | undefined;

    if (exception instanceof AppException) {
      // Use our custom exception format
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as {
        message?: string | string[];
        errorCode?: string;
      };
      message = exceptionResponse.message || message;
      errorCode = exceptionResponse.errorCode;
    } else if (exception instanceof HttpException) {
      // Handle standard NestJS HttpException
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

    const responseBody: {
      statusCode: number;
      message: string;
      error?: string;
      errorCode?: string;
    } = {
      statusCode: status,
      message: Array.isArray(message) ? message.join(', ') : message,
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
