import { Injectable } from '@nestjs/common';
import { IFavoritesRepository } from '../favorites.repository.interface';
import { Favorites } from '../../entities/favorites.entity';
import { RepositoryException } from '../../../common/errors';
import { ErrorCode } from '../../../common/errors';

@Injectable()
export class InMemoryFavoritesRepository implements IFavoritesRepository {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  async findAll(): Promise<Favorites> {
    return { ...this.favorites };
  }

  async addArtist(artistId: string): Promise<void> {
    if (!this.favorites.artists.includes(artistId)) {
      this.favorites.artists.push(artistId);
    }
  }

  async removeArtist(artistId: string): Promise<void> {
    const index = this.favorites.artists.indexOf(artistId);
    if (index === -1) {
      throw new RepositoryException(ErrorCode.FAVORITE_NOT_FOUND);
    }
    this.favorites.artists.splice(index, 1);
  }

  async addAlbum(albumId: string): Promise<void> {
    if (!this.favorites.albums.includes(albumId)) {
      this.favorites.albums.push(albumId);
    }
  }

  async removeAlbum(albumId: string): Promise<void> {
    const index = this.favorites.albums.indexOf(albumId);
    if (index === -1) {
      throw new RepositoryException(ErrorCode.FAVORITE_NOT_FOUND);
    }
    this.favorites.albums.splice(index, 1);
  }

  async addTrack(trackId: string): Promise<void> {
    if (!this.favorites.tracks.includes(trackId)) {
      this.favorites.tracks.push(trackId);
    }
  }

  async removeTrack(trackId: string): Promise<void> {
    const index = this.favorites.tracks.indexOf(trackId);
    if (index === -1) {
      throw new RepositoryException(ErrorCode.FAVORITE_NOT_FOUND);
    }
    this.favorites.tracks.splice(index, 1);
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    const index = this.favorites.artists.indexOf(artistId);
    if (index !== -1) {
      this.favorites.artists.splice(index, 1);
    }
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    const index = this.favorites.albums.indexOf(albumId);
    if (index !== -1) {
      this.favorites.albums.splice(index, 1);
    }
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    const index = this.favorites.tracks.indexOf(trackId);
    if (index !== -1) {
      this.favorites.tracks.splice(index, 1);
    }
  }
}
