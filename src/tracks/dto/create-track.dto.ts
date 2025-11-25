import { IsString, IsNotEmpty, IsInt, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty({
    description: 'Track name',
    example: 'The Show Must Go On',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Track duration in seconds',
    example: 262,
  })
  @IsInt()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    description: 'Artist unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    nullable: true,
    required: false,
  })
  @IsUUID()
  @IsOptional()
  artistId?: string | null;

  @ApiProperty({
    description: 'Album unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    nullable: true,
    required: false,
  })
  @IsUUID()
  @IsOptional()
  albumId?: string | null;
}

