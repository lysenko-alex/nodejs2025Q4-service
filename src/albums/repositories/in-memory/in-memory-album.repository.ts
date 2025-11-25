import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IAlbumRepository } from '../album.repository.interface';
import { Album } from '../../entities/album.entity';
import { CreateAlbumDto } from '../../dto/create-album.dto';
import { UpdateAlbumDto } from '../../dto/update-album.dto';
import { RepositoryException } from '../../../common/errors';
import { ErrorCode } from '../../../common/errors';

@Injectable()
export class InMemoryAlbumRepository implements IAlbumRepository {
  private albums: Album[] = [];

  async findAll(): Promise<Album[]> {
    return [...this.albums];
  }

  async findOne(id: string): Promise<Album | null> {
    return this.albums.find((album) => album.id === id) || null;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album: Album = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    this.albums.push(album);
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const albumIndex = this.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) {
      throw new RepositoryException(ErrorCode.ALBUM_NOT_FOUND);
    }

    const album = this.albums[albumIndex];
    const updatedAlbum: Album = {
      ...album,
      ...updateAlbumDto,
      artistId: updateAlbumDto.artistId !== undefined ? updateAlbumDto.artistId : album.artistId,
    };

    this.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  async delete(id: string): Promise<void> {
    const albumIndex = this.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) {
      throw new RepositoryException(ErrorCode.ALBUM_NOT_FOUND);
    }
    this.albums.splice(albumIndex, 1);
  }

  async nullifyArtistReferences(artistId: string): Promise<void> {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}

