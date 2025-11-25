import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMessages } from './error-codes';

export class AppException extends HttpException {
  constructor(
    public readonly errorCode: ErrorCode,
    statusCode: HttpStatus,
    message?: string,
  ) {
    super(
      {
        statusCode,
        message: message || ErrorMessages[errorCode],
        errorCode,
      },
      statusCode,
    );
  }
}

export class BadRequestException extends AppException {
  constructor(errorCode: ErrorCode, message?: string) {
    super(errorCode, HttpStatus.BAD_REQUEST, message);
  }
}

export class ForbiddenException extends AppException {
  constructor(errorCode: ErrorCode, message?: string) {
    super(errorCode, HttpStatus.FORBIDDEN, message);
  }
}

export class NotFoundException extends AppException {
  constructor(errorCode: ErrorCode, message?: string) {
    super(errorCode, HttpStatus.NOT_FOUND, message);
  }
}

export class UnprocessableEntityException extends AppException {
  constructor(errorCode: ErrorCode, message?: string) {
    super(errorCode, HttpStatus.UNPROCESSABLE_ENTITY, message);
  }
}
