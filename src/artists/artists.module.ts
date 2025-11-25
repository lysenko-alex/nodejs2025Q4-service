import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { InMemoryArtistRepository } from './repositories/in-memory/in-memory-artist.repository';

@Module({
  controllers: [ArtistsController],
  providers: [
    ArtistsService,
    {
      provide: 'IArtistRepository',
      useClass: InMemoryArtistRepository,
    },
  ],
})
export class ArtistsModule {}
