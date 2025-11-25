import { Track } from '../entities/track.entity';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';

export interface ITrackRepository {
  findAll(): Promise<Track[]>;
  findOne(id: string): Promise<Track | null>;
  create(createTrackDto: CreateTrackDto): Promise<Track>;
  update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track>;
  delete(id: string): Promise<void>;
  nullifyArtistReferences(artistId: string): Promise<void>;
  nullifyAlbumReferences(albumId: string): Promise<void>;
}

