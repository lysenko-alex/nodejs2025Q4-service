import { Module, forwardRef } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { InMemoryAlbumRepository } from './repositories/in-memory/in-memory-album.repository';
import { TracksModule } from '../tracks/tracks.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  controllers: [AlbumsController],
  imports: [forwardRef(() => TracksModule), forwardRef(() => FavoritesModule)],
  providers: [
    AlbumsService,
    {
      provide: 'IAlbumRepository',
      useClass: InMemoryAlbumRepository,
    },
  ],
  exports: [AlbumsService],
})
export class AlbumsModule {}
