import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaUserRepository } from './repositories/prisma/prisma-user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: ['IUserRepository'],
})
export class UsersModule {}
