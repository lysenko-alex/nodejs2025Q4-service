import { ErrorCode } from './error-codes';

/**
 * Base domain exception for repository and business logic errors
 * These are caught and converted to HTTP exceptions in the service layer
 */
export class DomainException extends Error {
  constructor(
    public readonly errorCode: ErrorCode,
    message?: string,
  ) {
    super(message);
    this.name = 'DomainException';
    // Maintains proper stack trace for where our error was thrown (only on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainException);
    }
  }
}

/**
 * Repository-specific exceptions
 */
export class RepositoryException extends DomainException {
  constructor(errorCode: ErrorCode, message?: string) {
    super(errorCode, message);
    this.name = 'RepositoryException';
  }
}

/**
 * Business logic exceptions
 */
export class BusinessLogicException extends DomainException {
  constructor(errorCode: ErrorCode, message?: string) {
    super(errorCode, message);
    this.name = 'BusinessLogicException';
  }
}

