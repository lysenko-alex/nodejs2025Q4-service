import { Favorites } from '../entities/favorites.entity';

export interface IFavoritesRepository {
  findAll(): Promise<Favorites>;
  addArtist(artistId: string): Promise<void>;
  removeArtist(artistId: string): Promise<void>;
  addAlbum(albumId: string): Promise<void>;
  removeAlbum(albumId: string): Promise<void>;
  addTrack(trackId: string): Promise<void>;
  removeTrack(trackId: string): Promise<void>;
  removeArtistFromFavorites(artistId: string): Promise<void>;
  removeAlbumFromFavorites(albumId: string): Promise<void>;
  removeTrackFromFavorites(trackId: string): Promise<void>;
}
