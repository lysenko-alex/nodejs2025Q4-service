import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'User unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string; // uuid v4

  @ApiProperty({
    description: 'User login',
    example: 'TestUser',
  })
  login: string;

  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Version number, increments on update',
    example: 1,
  })
  version: number; // integer number, increments on update

  @ApiProperty({
    description: 'Timestamp of creation',
    example: 1655000000,
  })
  createdAt: number; // timestamp of creation

  @ApiProperty({
    description: 'Timestamp of last update',
    example: 1655000000,
  })
  updatedAt: number; // timestamp of last update
}
