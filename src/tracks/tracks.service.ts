import { Injectable, Inject } from '@nestjs/common';
import { validate } from 'uuid';
import { ITrackRepository } from './repositories/track.repository.interface';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import {
  BadRequestException,
  NotFoundException,
  ErrorCode,
  DomainException,
  convertDomainExceptionToHttp,
} from '../common/errors';

@Injectable()
export class TracksService {
  constructor(
    @Inject('ITrackRepository')
    private readonly trackRepository: ITrackRepository,
  ) {}

  async findAll(): Promise<Track[]> {
    return this.trackRepository.findAll();
  }

  async findOne(id: string): Promise<Track> {
    if (!validate(id)) {
      throw new BadRequestException(ErrorCode.INVALID_UUID);
    }

    const track = await this.trackRepository.findOne(id);
    if (!track) {
      throw new NotFoundException(ErrorCode.TRACK_NOT_FOUND);
    }

    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    return this.trackRepository.create(createTrackDto);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    if (!validate(id)) {
      throw new BadRequestException(ErrorCode.INVALID_UUID);
    }

    try {
      return await this.trackRepository.update(id, updateTrackDto);
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
      await this.trackRepository.delete(id);
    } catch (error) {
      if (error instanceof DomainException) {
        throw convertDomainExceptionToHttp(error);
      }
      throw error;
    }
  }

  async nullifyArtistReferences(artistId: string): Promise<void> {
    await this.trackRepository.nullifyArtistReferences(artistId);
  }

  async nullifyAlbumReferences(albumId: string): Promise<void> {
    await this.trackRepository.nullifyAlbumReferences(albumId);
  }
}
