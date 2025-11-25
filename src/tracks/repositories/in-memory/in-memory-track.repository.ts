import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ITrackRepository } from '../track.repository.interface';
import { Track } from '../../entities/track.entity';
import { CreateTrackDto } from '../../dto/create-track.dto';
import { UpdateTrackDto } from '../../dto/update-track.dto';
import { RepositoryException } from '../../../common/errors';
import { ErrorCode } from '../../../common/errors';

@Injectable()
export class InMemoryTrackRepository implements ITrackRepository {
  private tracks: Track[] = [];

  async findAll(): Promise<Track[]> {
    return [...this.tracks];
  }

  async findOne(id: string): Promise<Track | null> {
    return this.tracks.find((track) => track.id === id) || null;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track: Track = {
      id: randomUUID(),
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
    };
    this.tracks.push(track);
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new RepositoryException(ErrorCode.TRACK_NOT_FOUND);
    }

    const track = this.tracks[trackIndex];
    const updatedTrack: Track = {
      ...track,
      ...updateTrackDto,
      artistId:
        updateTrackDto.artistId !== undefined
          ? updateTrackDto.artistId
          : track.artistId,
      albumId:
        updateTrackDto.albumId !== undefined
          ? updateTrackDto.albumId
          : track.albumId,
    };

    this.tracks[trackIndex] = updatedTrack;
    return updatedTrack;
  }

  async delete(id: string): Promise<void> {
    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new RepositoryException(ErrorCode.TRACK_NOT_FOUND);
    }
    this.tracks.splice(trackIndex, 1);
  }

  async nullifyArtistReferences(artistId: string): Promise<void> {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  async nullifyAlbumReferences(albumId: string): Promise<void> {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}

