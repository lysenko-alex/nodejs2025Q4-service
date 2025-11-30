import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { validate } from 'uuid';
import { IFavoritesRepository } from './repositories/favorites.repository.interface';
import { FavoritesResponseDto } from './dto/favorites-response.dto';
import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
  ErrorCode,
  DomainException,
  convertDomainExceptionToHttp,
  getErrorMessage,
  EntityType,
} from '../common/errors';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject('IFavoritesRepository')
    private readonly favoritesRepository: IFavoritesRepository,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  async findAll(): Promise<FavoritesResponseDto> {
    const favorites = await this.favoritesRepository.findAll();

    const artists = await Promise.allSettled(
      favorites.artists.map((id) => this.artistsService.findOne(id)),
    ).then((results) =>
      results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<any>).value),
    );

    const albums = await Promise.allSettled(
      favorites.albums.map((id) => this.albumsService.findOne(id)),
    ).then((results) =>
      results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<any>).value),
    );

    const tracks = await Promise.allSettled(
      favorites.tracks.map((id) => this.tracksService.findOne(id)),
    ).then((results) =>
      results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<any>).value),
    );

    return {
      artists,
      albums,
      tracks,
    };
  }

  async addArtist(artistId: string): Promise<void> {
    if (!validate(artistId)) {
      throw new BadRequestException(
        ErrorCode.INVALID_UUID,
        getErrorMessage(ErrorCode.INVALID_UUID, EntityType.ARTIST, true),
      );
    }

    try {
      await this.artistsService.findOne(artistId);
      await this.favoritesRepository.addArtist(artistId);
    } catch (error) {
      if (error instanceof DomainException) {
        throw convertDomainExceptionToHttp(error);
      }
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          ErrorCode.ENTITY_DOES_NOT_EXIST,
          getErrorMessage(ErrorCode.ENTITY_DOES_NOT_EXIST, EntityType.ARTIST),
        );
      }
      throw error;
    }
  }

  async removeArtist(artistId: string): Promise<void> {
    if (!validate(artistId)) {
      throw new BadRequestException(
        ErrorCode.INVALID_UUID,
        getErrorMessage(ErrorCode.INVALID_UUID, EntityType.ARTIST, true),
      );
    }

    try {
      await this.favoritesRepository.removeArtist(artistId);
    } catch (error) {
      if (error instanceof DomainException) {
        const httpException = convertDomainExceptionToHttp(error);
        if (httpException.errorCode === ErrorCode.FAVORITE_NOT_FOUND) {
          throw new NotFoundException(
            ErrorCode.FAVORITE_NOT_FOUND,
            getErrorMessage(
              ErrorCode.FAVORITE_NOT_FOUND,
              EntityType.ARTIST,
              true,
            ),
          );
        }
        throw httpException;
      }
      throw error;
    }
  }

  async addAlbum(albumId: string): Promise<void> {
    if (!validate(albumId)) {
      throw new BadRequestException(
        ErrorCode.INVALID_UUID,
        getErrorMessage(ErrorCode.INVALID_UUID, EntityType.ALBUM, true),
      );
    }

    try {
      await this.albumsService.findOne(albumId);
      await this.favoritesRepository.addAlbum(albumId);
    } catch (error) {
      if (error instanceof DomainException) {
        throw convertDomainExceptionToHttp(error);
      }
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          ErrorCode.ENTITY_DOES_NOT_EXIST,
          getErrorMessage(ErrorCode.ENTITY_DOES_NOT_EXIST, EntityType.ALBUM),
        );
      }
      throw error;
    }
  }

  async removeAlbum(albumId: string): Promise<void> {
    if (!validate(albumId)) {
      throw new BadRequestException(
        ErrorCode.INVALID_UUID,
        getErrorMessage(ErrorCode.INVALID_UUID, EntityType.ALBUM, true),
      );
    }

    try {
      await this.favoritesRepository.removeAlbum(albumId);
    } catch (error) {
      if (error instanceof DomainException) {
        const httpException = convertDomainExceptionToHttp(error);
        if (httpException.errorCode === ErrorCode.FAVORITE_NOT_FOUND) {
          throw new NotFoundException(
            ErrorCode.FAVORITE_NOT_FOUND,
            getErrorMessage(
              ErrorCode.FAVORITE_NOT_FOUND,
              EntityType.ALBUM,
              true,
            ),
          );
        }
        throw httpException;
      }
      throw error;
    }
  }

  async addTrack(trackId: string): Promise<void> {
    if (!validate(trackId)) {
      throw new BadRequestException(
        ErrorCode.INVALID_UUID,
        getErrorMessage(ErrorCode.INVALID_UUID, EntityType.TRACK, true),
      );
    }

    try {
      await this.tracksService.findOne(trackId);
      await this.favoritesRepository.addTrack(trackId);
    } catch (error) {
      if (error instanceof DomainException) {
        throw convertDomainExceptionToHttp(error);
      }
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException(
          ErrorCode.ENTITY_DOES_NOT_EXIST,
          getErrorMessage(ErrorCode.ENTITY_DOES_NOT_EXIST, EntityType.TRACK),
        );
      }
      throw error;
    }
  }

  async removeTrack(trackId: string): Promise<void> {
    if (!validate(trackId)) {
      throw new BadRequestException(
        ErrorCode.INVALID_UUID,
        getErrorMessage(ErrorCode.INVALID_UUID, EntityType.TRACK, true),
      );
    }

    try {
      await this.favoritesRepository.removeTrack(trackId);
    } catch (error) {
      if (error instanceof DomainException) {
        const httpException = convertDomainExceptionToHttp(error);
        if (httpException.errorCode === ErrorCode.FAVORITE_NOT_FOUND) {
          throw new NotFoundException(
            ErrorCode.FAVORITE_NOT_FOUND,
            getErrorMessage(
              ErrorCode.FAVORITE_NOT_FOUND,
              EntityType.TRACK,
              true,
            ),
          );
        }
        throw httpException;
      }
      throw error;
    }
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    await this.favoritesRepository.removeArtistFromFavorites(artistId);
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    await this.favoritesRepository.removeAlbumFromFavorites(albumId);
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    await this.favoritesRepository.removeTrackFromFavorites(trackId);
  }
}
