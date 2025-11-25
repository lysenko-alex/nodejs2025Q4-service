import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
  AppException,
} from './custom-exceptions';
import { DomainException } from './domain-exceptions';
import { ErrorCode } from './error-codes';

/**
 * Converts domain exceptions to appropriate HTTP exceptions
 */
export function convertDomainExceptionToHttp(
  error: DomainException,
): AppException {
  switch (error.errorCode) {
    case ErrorCode.INVALID_UUID:
    case ErrorCode.MISSING_REQUIRED_FIELDS:
      return new BadRequestException(error.errorCode);

    case ErrorCode.WRONG_OLD_PASSWORD:
      return new ForbiddenException(error.errorCode);

    case ErrorCode.USER_NOT_FOUND:
    case ErrorCode.ARTIST_NOT_FOUND:
    case ErrorCode.ALBUM_NOT_FOUND:
    case ErrorCode.TRACK_NOT_FOUND:
    case ErrorCode.FAVORITE_NOT_FOUND:
      return new NotFoundException(error.errorCode);

    case ErrorCode.ENTITY_DOES_NOT_EXIST:
      return new UnprocessableEntityException(error.errorCode);

    default:
      // Fallback to NotFoundException for unknown domain errors
      return new NotFoundException(error.errorCode);
  }
}
