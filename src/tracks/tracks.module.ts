import { Module, forwardRef } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { InMemoryTrackRepository } from './repositories/in-memory/in-memory-track.repository';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  controllers: [TracksController],
  imports: [forwardRef(() => FavoritesModule)],
  providers: [
    TracksService,
    {
      provide: 'ITrackRepository',
      useClass: InMemoryTrackRepository,
    },
  ],
  exports: [TracksService],
})
export class TracksModule {}
