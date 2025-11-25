import { Album } from '../entities/album.entity';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';

export interface IAlbumRepository {
  findAll(): Promise<Album[]>;
  findOne(id: string): Promise<Album | null>;
  create(createAlbumDto: CreateAlbumDto): Promise<Album>;
  update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album>;
  delete(id: string): Promise<void>;
  nullifyArtistReferences(artistId: string): Promise<void>;
}
