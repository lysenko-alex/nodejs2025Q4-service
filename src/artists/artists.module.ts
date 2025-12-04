import { Module, forwardRef } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { PrismaArtistRepository } from './repositories/prisma/prisma-artist.repository';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  controllers: [ArtistsController],
  imports: [
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule),
  ],
  providers: [
    ArtistsService,
    {
      provide: 'IArtistRepository',
      useClass: PrismaArtistRepository,
    },
  ],
  exports: [ArtistsService],
})
export class ArtistsModule {}
