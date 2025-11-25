import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { FavoritesResponseDto } from './dto/favorites-response.dto';

@ApiTags('favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({
    status: 200,
    description: 'List of all favorites',
    type: FavoritesResponseDto,
  })
  async findAll(): Promise<FavoritesResponseDto> {
    return this.favoritesService.findAll();
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add artist to favorites' })
  @ApiParam({
    name: 'id',
    description: 'Artist unique identifier',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Artist added to favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'artistId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 422,
    description: 'Artist with id does not exist',
  })
  async addArtist(@Param('id') id: string): Promise<void> {
    return this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete artist from favorites' })
  @ApiParam({
    name: 'id',
    description: 'Artist unique identifier',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Artist removed from favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'artistId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 404,
    description: 'Artist is not favorite',
  })
  async removeArtist(@Param('id') id: string): Promise<void> {
    return this.favoritesService.removeArtist(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add album to favorites' })
  @ApiParam({
    name: 'id',
    description: 'Album unique identifier',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Album added to favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'albumId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 422,
    description: 'Album with id does not exist',
  })
  async addAlbum(@Param('id') id: string): Promise<void> {
    return this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete album from favorites' })
  @ApiParam({
    name: 'id',
    description: 'Album unique identifier',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Album removed from favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'albumId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 404,
    description: 'Album is not favorite',
  })
  async removeAlbum(@Param('id') id: string): Promise<void> {
    return this.favoritesService.removeAlbum(id);
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add track to favorites' })
  @ApiParam({
    name: 'id',
    description: 'Track unique identifier',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Track added to favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'trackId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 422,
    description: 'Track with id does not exist',
  })
  async addTrack(@Param('id') id: string): Promise<void> {
    return this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete track from favorites' })
  @ApiParam({
    name: 'id',
    description: 'Track unique identifier',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Track removed from favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'trackId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 404,
    description: 'Track is not favorite',
  })
  async removeTrack(@Param('id') id: string): Promise<void> {
    return this.favoritesService.removeTrack(id);
  }
}
