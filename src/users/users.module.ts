import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { InMemoryUserRepository } from './repositories/in-memory/in-memory-user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: InMemoryUserRepository,
    },
  ],
})
export class UsersModule {}
