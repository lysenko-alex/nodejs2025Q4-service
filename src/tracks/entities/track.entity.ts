import { ApiProperty } from '@nestjs/swagger';

export class Track {
  @ApiProperty({
    description: 'Track unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string; // uuid v4

  @ApiProperty({
    description: 'Track name',
    example: 'The Show Must Go On',
  })
  name: string;

  @ApiProperty({
    description: 'Artist unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    nullable: true,
  })
  artistId: string | null; // refers to Artist

  @ApiProperty({
    description: 'Album unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    nullable: true,
  })
  albumId: string | null; // refers to Album

  @ApiProperty({
    description: 'Track duration in seconds',
    example: 262,
  })
  duration: number; // integer number
}
