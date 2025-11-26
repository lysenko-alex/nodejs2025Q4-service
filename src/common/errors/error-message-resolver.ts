import { ErrorCode, ErrorMessages } from './error-codes';
import {
  EntityType,
  EntityErrorMessages,
  FavoriteEntityErrorMessages,
} from './entity-error-messages';

export function getErrorMessage(
  errorCode: ErrorCode,
  entityType?: EntityType,
  isFavoriteContext = false,
): string {
  if (isFavoriteContext && entityType) {
    const favoriteMessage =
      FavoriteEntityErrorMessages[entityType]?.[errorCode];
    if (favoriteMessage) {
      return favoriteMessage;
    }
  }

  if (entityType) {
    const entityMessage = EntityErrorMessages[entityType]?.[errorCode];
    if (entityMessage) {
      return entityMessage;
    }
  }

  return ErrorMessages[errorCode];
}
