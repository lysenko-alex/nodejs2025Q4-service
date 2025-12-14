import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { IUserRepository } from '../user.repository.interface';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdatePasswordDto } from '../../dto/update-password.dto';
import { RepositoryException, ErrorCode } from '../../../common/errors';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return users.map((user) =>
      plainToInstance(User, {
        ...user,
        createdAt: Number(user.createdAt),
        updatedAt: Number(user.updatedAt),
      }),
    );
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user
      ? plainToInstance(User, {
          ...user,
          createdAt: Number(user.createdAt),
          updatedAt: Number(user.updatedAt),
        })
      : null;
  }

  async findByLogin(login: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });
    return user
      ? plainToInstance(User, {
          ...user,
          createdAt: Number(user.createdAt),
          updatedAt: Number(user.updatedAt),
        })
      : null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const now = BigInt(Date.now());
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: hashedPassword,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
    });
    return plainToInstance(User, {
      ...user,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    });
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

    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new RepositoryException(ErrorCode.WRONG_OLD_PASSWORD);
    }

    const hashedNewPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      10,
    );

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
        version: existingUser.version + 1,
        updatedAt: BigInt(Date.now()),
      },
    });

    return plainToInstance(User, {
      ...user,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    });
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
}
