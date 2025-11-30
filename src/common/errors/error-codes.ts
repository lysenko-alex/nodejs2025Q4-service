export enum ErrorCode {
  INVALID_UUID = 'INVALID_UUID',
  MISSING_REQUIRED_FIELDS = 'MISSING_REQUIRED_FIELDS',

  WRONG_OLD_PASSWORD = 'WRONG_OLD_PASSWORD',

  USER_NOT_FOUND = 'USER_NOT_FOUND',
  ARTIST_NOT_FOUND = 'ARTIST_NOT_FOUND',
  ALBUM_NOT_FOUND = 'ALBUM_NOT_FOUND',
  TRACK_NOT_FOUND = 'TRACK_NOT_FOUND',
  FAVORITE_NOT_FOUND = 'FAVORITE_NOT_FOUND',

  ENTITY_DOES_NOT_EXIST = 'ENTITY_DOES_NOT_EXIST',
}

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_UUID]: 'id is invalid (not uuid)',
  [ErrorCode.MISSING_REQUIRED_FIELDS]: 'body does not contain required fields',
  [ErrorCode.WRONG_OLD_PASSWORD]: 'oldPassword is wrong',
  [ErrorCode.USER_NOT_FOUND]: 'User not found',
  [ErrorCode.ARTIST_NOT_FOUND]: 'Artist was not found.',
  [ErrorCode.ALBUM_NOT_FOUND]: 'Album was not found.',
  [ErrorCode.TRACK_NOT_FOUND]: 'Track was not found.',
  [ErrorCode.FAVORITE_NOT_FOUND]: 'Favorite not found',
  [ErrorCode.ENTITY_DOES_NOT_EXIST]: 'Entity does not exist',
};
