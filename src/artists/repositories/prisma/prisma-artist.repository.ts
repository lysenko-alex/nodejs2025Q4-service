import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IArtistRepository } from '../artist.repository.interface';
import { Artist } from '../../entities/artist.entity';
import { CreateArtistDto } from '../../dto/create-artist.dto';
import { UpdateArtistDto } from '../../dto/update-artist.dto';
import { RepositoryException, ErrorCode } from '../../../common/errors';

@Injectable()
export class PrismaArtistRepository implements IArtistRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Artist[]> {
    const artists = await this.prisma.artist.findMany({
      orderBy: { name: 'asc' },
    });
    return artists.map((artist) => this.mapToEntity(artist));
  }

  async findOne(id: string): Promise<Artist | null> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });
    return artist ? this.mapToEntity(artist) : null;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = await this.prisma.artist.create({
      data: {
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      },
    });
    return this.mapToEntity(artist);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    try {
      const artist = await this.prisma.artist.update({
        where: { id },
        data: {
          name: updateArtistDto.name,
          grammy: updateArtistDto.grammy,
        },
      });
      return this.mapToEntity(artist);
    } catch (error) {
      throw new RepositoryException(ErrorCode.ARTIST_NOT_FOUND);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.artist.delete({
        where: { id },
      });
    } catch (error) {
      throw new RepositoryException(ErrorCode.ARTIST_NOT_FOUND);
    }
  }

  private mapToEntity(artist: {
    id: string;
    name: string;
    grammy: boolean;
  }): Artist {
    return {
      id: artist.id,
      name: artist.name,
      grammy: artist.grammy,
    };
  }
}
