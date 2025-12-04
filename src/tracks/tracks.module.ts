import { Module, forwardRef } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { PrismaTrackRepository } from './repositories/prisma/prisma-track.repository';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  controllers: [TracksController],
  imports: [forwardRef(() => FavoritesModule)],
  providers: [
    TracksService,
    {
      provide: 'ITrackRepository',
      useClass: PrismaTrackRepository,
    },
  ],
  exports: [TracksService],
})
export class TracksModule {}
