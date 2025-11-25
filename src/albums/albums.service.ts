import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { validate } from 'uuid';
import { IAlbumRepository } from './repositories/album.repository.interface';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import {
  BadRequestException,
  NotFoundException,
  ErrorCode,
  DomainException,
  convertDomainExceptionToHttp,
} from '../common/errors';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject('IAlbumRepository')
    private readonly albumRepository: IAlbumRepository,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<Album[]> {
    return this.albumRepository.findAll();
  }

  async findOne(id: string): Promise<Album> {
    if (!validate(id)) {
      throw new BadRequestException(ErrorCode.INVALID_UUID);
    }

    const album = await this.albumRepository.findOne(id);
    if (!album) {
      throw new NotFoundException(ErrorCode.ALBUM_NOT_FOUND);
    }

    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.albumRepository.create(createAlbumDto);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    if (!validate(id)) {
      throw new BadRequestException(ErrorCode.INVALID_UUID);
    }

    try {
      return await this.albumRepository.update(id, updateAlbumDto);
    } catch (error) {
      if (error instanceof DomainException) {
        throw convertDomainExceptionToHttp(error);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException(ErrorCode.INVALID_UUID);
    }

    try {
      // Nullify references in tracks before deleting
      await this.tracksService.nullifyAlbumReferences(id);
      // Remove from favorites
      await this.favoritesService.removeAlbumFromFavorites(id);

      await this.albumRepository.delete(id);
    } catch (error) {
      if (error instanceof DomainException) {
        throw convertDomainExceptionToHttp(error);
      }
      throw error;
    }
  }

  async nullifyArtistReferences(artistId: string): Promise<void> {
    await this.albumRepository.nullifyArtistReferences(artistId);
  }
}
