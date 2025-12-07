import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IUserRepository } from '../user.repository.interface';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdatePasswordDto } from '../../dto/update-password.dto';
import { RepositoryException, ErrorCode } from '../../../common/errors';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return users.map((user) => this.mapToEntity(user));
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.mapToEntity(user) : null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const now = BigInt(Date.now());
    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
    });
    return this.mapToEntity(user);
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new RepositoryException(ErrorCode.USER_NOT_FOUND);
    }

    if (existingUser.password !== updatePasswordDto.oldPassword) {
      throw new RepositoryException(ErrorCode.WRONG_OLD_PASSWORD);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: existingUser.version + 1,
        updatedAt: BigInt(Date.now()),
      },
    });

    return this.mapToEntity(user);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new RepositoryException(ErrorCode.USER_NOT_FOUND);
    }
  }

  private mapToEntity(user: {
    id: string;
    login: string;
    password: string;
    version: number;
    createdAt: bigint;
    updatedAt: bigint;
  }): User {
    return {
      id: user.id,
      login: user.login,
      password: user.password,
      version: user.version,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }
}
