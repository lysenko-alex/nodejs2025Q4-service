import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ITrackRepository } from '../track.repository.interface';
import { Track } from '../../entities/track.entity';
import { CreateTrackDto } from '../../dto/create-track.dto';
import { UpdateTrackDto } from '../../dto/update-track.dto';
import { RepositoryException, ErrorCode } from '../../../common/errors';

@Injectable()
export class PrismaTrackRepository implements ITrackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany({
      orderBy: { name: 'asc' },
    });
    return tracks.map((track) => this.mapToEntity(track));
  }

  async findOne(id: string): Promise<Track | null> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    return track ? this.mapToEntity(track) : null;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track = await this.prisma.track.create({
      data: {
        name: createTrackDto.name,
        duration: createTrackDto.duration,
        artistId: createTrackDto.artistId || null,
        albumId: createTrackDto.albumId || null,
      },
    });
    return this.mapToEntity(track);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    try {
      const track = await this.prisma.track.update({
        where: { id },
        data: {
          name: updateTrackDto.name,
          duration: updateTrackDto.duration,
          artistId:
            updateTrackDto.artistId !== undefined
              ? updateTrackDto.artistId
              : undefined,
          albumId:
            updateTrackDto.albumId !== undefined
              ? updateTrackDto.albumId
              : undefined,
        },
      });
      return this.mapToEntity(track);
    } catch (error) {
      throw new RepositoryException(ErrorCode.TRACK_NOT_FOUND);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.track.delete({
        where: { id },
      });
    } catch (error) {
      throw new RepositoryException(ErrorCode.TRACK_NOT_FOUND);
    }
  }

  async nullifyArtistReferences(artistId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  async nullifyAlbumReferences(albumId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }

  private mapToEntity(track: {
    id: string;
    name: string;
    artistId: string | null;
    albumId: string | null;
    duration: number;
  }): Track {
    return {
      id: track.id,
      name: track.name,
      artistId: track.artistId,
      albumId: track.albumId,
      duration: track.duration,
    };
  }
}
