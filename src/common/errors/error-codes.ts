export enum ErrorCode {
  // Validation errors (400)
  INVALID_UUID = 'INVALID_UUID',
  MISSING_REQUIRED_FIELDS = 'MISSING_REQUIRED_FIELDS',

  // Authentication errors (403)
  WRONG_OLD_PASSWORD = 'WRONG_OLD_PASSWORD',

  // Not found errors (404)
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  ARTIST_NOT_FOUND = 'ARTIST_NOT_FOUND',
  ALBUM_NOT_FOUND = 'ALBUM_NOT_FOUND',
  TRACK_NOT_FOUND = 'TRACK_NOT_FOUND',
  FAVORITE_NOT_FOUND = 'FAVORITE_NOT_FOUND',

  // Unprocessable entity errors (422)
  ENTITY_DOES_NOT_EXIST = 'ENTITY_DOES_NOT_EXIST',
}

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_UUID]: 'userId is invalid (not uuid)',
  [ErrorCode.MISSING_REQUIRED_FIELDS]: 'body does not contain required fields',
  [ErrorCode.WRONG_OLD_PASSWORD]: 'oldPassword is wrong',
  [ErrorCode.USER_NOT_FOUND]: 'User not found',
  [ErrorCode.ARTIST_NOT_FOUND]: 'Artist not found',
  [ErrorCode.ALBUM_NOT_FOUND]: 'Album not found',
  [ErrorCode.TRACK_NOT_FOUND]: 'Track not found',
  [ErrorCode.FAVORITE_NOT_FOUND]: 'Favorite not found',
  [ErrorCode.ENTITY_DOES_NOT_EXIST]: 'Entity does not exist',
};
