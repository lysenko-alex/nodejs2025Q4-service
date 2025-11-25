import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@ApiTags('tracks')
@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tracks' })
  @ApiResponse({
    status: 200,
    description: 'List of all tracks',
    type: [Track],
  })
  async findAll(): Promise<Track[]> {
    return this.tracksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single track by id' })
  @ApiParam({
    name: 'id',
    description: 'Track unique identifier',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Track found',
    type: Track,
  })
  @ApiResponse({
    status: 400,
    description: 'trackId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 404,
    description: 'Track not found',
  })
  async findOne(@Param('id') id: string): Promise<Track> {
    return this.tracksService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new track' })
  @ApiBody({ type: CreateTrackDto })
  @ApiResponse({
    status: 201,
    description: 'Track created successfully',
    type: Track,
  })
  @ApiResponse({
    status: 400,
    description: 'body does not contain required fields',
  })
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.tracksService.create(createTrackDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update track info' })
  @ApiParam({
    name: 'id',
    description: 'Track unique identifier',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateTrackDto })
  @ApiResponse({
    status: 200,
    description: 'Track updated successfully',
    type: Track,
  })
  @ApiResponse({
    status: 400,
    description: 'trackId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 404,
    description: 'Track not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete track' })
  @ApiParam({
    name: 'id',
    description: 'Track unique identifier',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Track deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'trackId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 404,
    description: 'Track not found',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.tracksService.delete(id);
  }
}
