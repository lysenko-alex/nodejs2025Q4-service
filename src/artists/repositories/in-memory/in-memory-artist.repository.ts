import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IArtistRepository } from '../artist.repository.interface';
import { Artist } from '../../entities/artist.entity';
import { CreateArtistDto } from '../../dto/create-artist.dto';
import { UpdateArtistDto } from '../../dto/update-artist.dto';
import { RepositoryException } from '../../../common/errors';
import { ErrorCode } from '../../../common/errors';

@Injectable()
export class InMemoryArtistRepository implements IArtistRepository {
  private artists: Artist[] = [];

  async findAll(): Promise<Artist[]> {
    return [...this.artists];
  }

  async findOne(id: string): Promise<Artist | null> {
    return this.artists.find((artist) => artist.id === id) || null;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist: Artist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.artists.push(artist);
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1) {
      throw new RepositoryException(ErrorCode.ARTIST_NOT_FOUND);
    }

    const artist = this.artists[artistIndex];
    const updatedArtist: Artist = {
      ...artist,
      ...updateArtistDto,
    };

    this.artists[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  async delete(id: string): Promise<void> {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1) {
      throw new RepositoryException(ErrorCode.ARTIST_NOT_FOUND);
    }
    this.artists.splice(artistIndex, 1);
  }
}
