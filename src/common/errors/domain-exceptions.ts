import { ErrorCode } from './error-codes';

export class DomainException extends Error {
  constructor(
    public readonly errorCode: ErrorCode,
    message?: string,
  ) {
    super(message);
    this.name = 'DomainException';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainException);
    }
  }
}

export class RepositoryException extends DomainException {
  constructor(errorCode: ErrorCode, message?: string) {
    super(errorCode, message);
    this.name = 'RepositoryException';
  }
}

export class BusinessLogicException extends DomainException {
  constructor(errorCode: ErrorCode, message?: string) {
    super(errorCode, message);
    this.name = 'BusinessLogicException';
  }
}
