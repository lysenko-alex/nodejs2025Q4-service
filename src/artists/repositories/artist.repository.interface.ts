import { Artist } from '../entities/artist.entity';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';

export interface IArtistRepository {
  findAll(): Promise<Artist[]>;
  findOne(id: string): Promise<Artist | null>;
  create(createArtistDto: CreateArtistDto): Promise<Artist>;
  update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist>;
  delete(id: string): Promise<void>;
}
