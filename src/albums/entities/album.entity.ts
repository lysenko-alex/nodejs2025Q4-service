import { ApiProperty } from '@nestjs/swagger';

export class Album {
  @ApiProperty({
    description: 'Album unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Album name',
    example: 'Innuendo',
  })
  name: string;

  @ApiProperty({
    description: 'Album release year',
    example: 1991,
  })
  year: number;

  @ApiProperty({
    description: 'Artist unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    nullable: true,
  })
  artistId: string | null;
}
