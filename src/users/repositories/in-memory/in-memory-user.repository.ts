import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IUserRepository } from '../user.repository.interface';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdatePasswordDto } from '../../dto/update-password.dto';
import { RepositoryException } from '../../../common/errors';
import { ErrorCode } from '../../../common/errors';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findOne(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);
    return user;
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new RepositoryException(ErrorCode.USER_NOT_FOUND);
    }

    const user = this.users[userIndex];
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new RepositoryException(ErrorCode.WRONG_OLD_PASSWORD);
    }

    const updatedUser: User = {
      ...user,
      password: updatePasswordDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new RepositoryException(ErrorCode.USER_NOT_FOUND);
    }
    this.users.splice(userIndex, 1);
  }
}
