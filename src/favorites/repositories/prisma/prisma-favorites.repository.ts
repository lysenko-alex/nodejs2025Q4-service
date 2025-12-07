import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IFavoritesRepository } from '../favorites.repository.interface';
import { Favorites } from '../../entities/favorites.entity';
import { RepositoryException, ErrorCode } from '../../../common/errors';

@Injectable()
export class PrismaFavoritesRepository implements IFavoritesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Favorites> {
    const [favoriteArtists, favoriteAlbums, favoriteTracks] = await Promise.all(
      [
        this.prisma.favoriteArtist.findMany({
          select: { artistId: true },
        }),
        this.prisma.favoriteAlbum.findMany({
          select: { albumId: true },
        }),
        this.prisma.favoriteTrack.findMany({
          select: { trackId: true },
        }),
      ],
    );

    return {
      artists: favoriteArtists.map((fa) => fa.artistId),
      albums: favoriteAlbums.map((fa) => fa.albumId),
      tracks: favoriteTracks.map((ft) => ft.trackId),
    };
  }

  async addArtist(artistId: string): Promise<void> {
    try {
      await this.prisma.favoriteArtist.create({
        data: { artistId },
      });
    } catch (error) {
      // Ignore unique constraint errors (already exists)
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code !== 'P2002'
      ) {
        throw error;
      }
    }
  }

  async removeArtist(artistId: string): Promise<void> {
    const favorite = await this.prisma.favoriteArtist.findUnique({
      where: { artistId },
    });

    if (!favorite) {
      throw new RepositoryException(ErrorCode.FAVORITE_NOT_FOUND);
    }
    try {
      await this.prisma.favoriteArtist.delete({
        where: { artistId },
      });
    } catch (error) {
      throw new RepositoryException(ErrorCode.FAVORITE_NOT_FOUND);
    }
  }

  async addAlbum(albumId: string): Promise<void> {
    try {
      await this.prisma.favoriteAlbum.create({
        data: { albumId },
      });
    } catch (error) {
      // Ignore unique constraint errors (already exists)
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code !== 'P2002'
      ) {
        throw error;
      }
    }
  }

  async removeAlbum(albumId: string): Promise<void> {
    const favorite = await this.prisma.favoriteAlbum.findUnique({
      where: { albumId },
    });

    if (!favorite) {
      throw new RepositoryException(ErrorCode.FAVORITE_NOT_FOUND);
    }

    try {
      await this.prisma.favoriteAlbum.delete({
        where: { albumId },
      });
    } catch (error) {
      throw new RepositoryException(ErrorCode.FAVORITE_NOT_FOUND);
    }
  }

  async addTrack(trackId: string): Promise<void> {
    try {
      await this.prisma.favoriteTrack.create({
        data: { trackId },
      });
    } catch (error) {
      // Ignore unique constraint errors (already exists)
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code !== 'P2002'
      ) {
        throw error;
      }
    }
  }

  async removeTrack(trackId: string): Promise<void> {
    const favorite = await this.prisma.favoriteTrack.findUnique({
      where: { trackId },
    });

    if (!favorite) {
      throw new RepositoryException(ErrorCode.FAVORITE_NOT_FOUND);
    }

    try {
      await this.prisma.favoriteTrack.delete({
        where: { trackId },
      });
    } catch (error) {
      throw new RepositoryException(ErrorCode.FAVORITE_NOT_FOUND);
    }
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    await this.prisma.favoriteArtist.deleteMany({
      where: { artistId },
    });
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    await this.prisma.favoriteAlbum.deleteMany({
      where: { albumId },
    });
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    await this.prisma.favoriteTrack.deleteMany({
      where: { trackId },
    });
  }
}
