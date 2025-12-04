import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IAlbumRepository } from '../album.repository.interface';
import { Album } from '../../entities/album.entity';
import { CreateAlbumDto } from '../../dto/create-album.dto';
import { UpdateAlbumDto } from '../../dto/update-album.dto';
import { ErrorCode } from '../../../common/errors/error-codes';
import { RepositoryException } from '../../../common/errors/domain-exceptions';

@Injectable()
export class PrismaAlbumRepository implements IAlbumRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Album[]> {
    const albums = await this.prisma.album.findMany({
      orderBy: { name: 'asc' },
    });
    return albums.map((album) => this.mapToEntity(album));
  }

  async findOne(id: string): Promise<Album | null> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    return album ? this.mapToEntity(album) : null;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = await this.prisma.album.create({
      data: {
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId || null,
      },
    });
    return this.mapToEntity(album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    try {
      const album = await this.prisma.album.update({
        where: { id },
        data: {
          name: updateAlbumDto.name,
          year: updateAlbumDto.year,
          artistId:
            updateAlbumDto.artistId !== undefined
              ? updateAlbumDto.artistId
              : undefined,
        },
      });
      return this.mapToEntity(album);
    } catch (error) {
      throw new RepositoryException(ErrorCode.ALBUM_NOT_FOUND);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.album.delete({
        where: { id },
      });
    } catch (error) {
      throw new RepositoryException(ErrorCode.ALBUM_NOT_FOUND);
    }
  }

  async nullifyArtistReferences(artistId: string): Promise<void> {
    await this.prisma.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  private mapToEntity(album: {
    id: string;
    name: string;
    year: number;
    artistId: string | null;
  }): Album {
    return {
      id: album.id,
      name: album.name,
      year: album.year,
      artistId: album.artistId,
    };
  }
}
