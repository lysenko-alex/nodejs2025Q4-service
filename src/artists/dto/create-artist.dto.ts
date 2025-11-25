import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({
    description: 'Artist name',
    example: 'Freddie Mercury',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Whether the artist has won a Grammy award',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}

