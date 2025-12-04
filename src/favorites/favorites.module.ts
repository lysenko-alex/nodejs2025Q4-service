import { Module, forwardRef } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { PrismaFavoritesRepository } from './repositories/prisma/prisma-favorites.repository';
import { ArtistsModule } from '../artists/artists.module';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  controllers: [FavoritesController],
  imports: [
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
  ],
  providers: [
    FavoritesService,
    {
      provide: 'IFavoritesRepository',
      useClass: PrismaFavoritesRepository,
    },
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
