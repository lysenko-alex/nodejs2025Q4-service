import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { InMemoryTrackRepository } from './repositories/in-memory/in-memory-track.repository';

@Module({
  controllers: [TracksController],
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
