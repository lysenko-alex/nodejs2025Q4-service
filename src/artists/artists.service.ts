import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { validate } from 'uuid';
import { IArtistRepository } from './repositories/artist.repository.interface';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import {
  BadRequestException,
  NotFoundException,
  ErrorCode,
  DomainException,
  convertDomainExceptionToHttp,
  getErrorMessage,
  EntityType,
} from '../common/errors';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject('IArtistRepository')
    private readonly artistRepository: IArtistRepository,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.findAll();
  }

  async findOne(id: string): Promise<Artist> {
    if (!validate(id)) {
      throw new BadRequestException(
        ErrorCode.INVALID_UUID,
        getErrorMessage(ErrorCode.INVALID_UUID, EntityType.ARTIST),
      );
    }

    const artist = await this.artistRepository.findOne(id);
    if (!artist) {
      throw new NotFoundException(ErrorCode.ARTIST_NOT_FOUND);
    }

    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.artistRepository.create(createArtistDto);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    if (!validate(id)) {
      throw new BadRequestException(
        ErrorCode.INVALID_UUID,
        getErrorMessage(ErrorCode.INVALID_UUID, EntityType.ARTIST),
      );
    }

    try {
      return await this.artistRepository.update(id, updateArtistDto);
    } catch (error) {
      if (error instanceof DomainException) {
        throw convertDomainExceptionToHttp(error);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException(
        ErrorCode.INVALID_UUID,
        getErrorMessage(ErrorCode.INVALID_UUID, EntityType.ARTIST),
      );
    }

    try {
      await this.albumsService.nullifyArtistReferences(id);
      await this.tracksService.nullifyArtistReferences(id);
      await this.favoritesService.removeArtistFromFavorites(id);

      await this.artistRepository.delete(id);
    } catch (error) {
      if (error instanceof DomainException) {
        throw convertDomainExceptionToHttp(error);
      }
      throw error;
    }
  }
}
