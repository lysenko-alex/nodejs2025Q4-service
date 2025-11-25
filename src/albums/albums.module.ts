import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { InMemoryAlbumRepository } from './repositories/in-memory/in-memory-album.repository';

@Module({
  controllers: [AlbumsController],
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
