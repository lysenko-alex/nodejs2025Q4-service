import { ErrorCode } from './error-codes';

export enum EntityType {
  USER = 'user',
  TRACK = 'track',
  ALBUM = 'album',
  ARTIST = 'artist',
  FAVORITE = 'favorite',
}

export const EntityErrorMessages: Record<
  EntityType,
  Partial<Record<ErrorCode, string>>
> = {
  [EntityType.USER]: {
    [ErrorCode.INVALID_UUID]: 'id is invalid (not uuid)',
    [ErrorCode.USER_NOT_FOUND]: 'User not found',
  },
  [EntityType.TRACK]: {
    [ErrorCode.INVALID_UUID]: 'trackId is invalid (not uuid)',
    [ErrorCode.TRACK_NOT_FOUND]: 'Track was not found.',
    [ErrorCode.ENTITY_DOES_NOT_EXIST]: 'Track with id does not exist',
  },
  [EntityType.ALBUM]: {
    [ErrorCode.INVALID_UUID]: 'albumId is invalid (not uuid)',
    [ErrorCode.ALBUM_NOT_FOUND]: 'Album was not found.',
    [ErrorCode.ENTITY_DOES_NOT_EXIST]: 'Album with id does not exist',
  },
  [EntityType.ARTIST]: {
    [ErrorCode.INVALID_UUID]: 'artistId is invalid (not uuid)',
    [ErrorCode.ARTIST_NOT_FOUND]: 'Artist was not found.',
    [ErrorCode.ENTITY_DOES_NOT_EXIST]: 'Artist with id does not exist',
  },
  [EntityType.FAVORITE]: {
    [ErrorCode.INVALID_UUID]: 'id is invalid (not uuid)',
    [ErrorCode.FAVORITE_NOT_FOUND]: 'Favorite not found',
  },
};

export const FavoriteEntityErrorMessages: Record<
  EntityType,
  Partial<Record<ErrorCode, string>>
> = {
  [EntityType.TRACK]: {
    [ErrorCode.FAVORITE_NOT_FOUND]: 'Track not found in favorites',
    [ErrorCode.INVALID_UUID]: 'trackId is invalid (not uuid)',
  },
  [EntityType.ALBUM]: {
    [ErrorCode.FAVORITE_NOT_FOUND]: 'Album not found in favorites',
    [ErrorCode.INVALID_UUID]: 'albumId is invalid (not uuid)',
  },
  [EntityType.ARTIST]: {
    [ErrorCode.FAVORITE_NOT_FOUND]: 'Artist not found in favorites',
    [ErrorCode.INVALID_UUID]: 'artistId is invalid (not uuid)',
  },
  [EntityType.USER]: {},
  [EntityType.FAVORITE]: {},
};
