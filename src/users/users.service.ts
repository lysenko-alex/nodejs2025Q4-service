import { Injectable, Inject } from '@nestjs/common';
import { validate } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { IUserRepository } from './repositories/user.repository.interface';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import {
  BadRequestException,
  NotFoundException,
  ErrorCode,
  DomainException,
  convertDomainExceptionToHttp,
} from '../common/errors';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => plainToInstance(User, user));
  }

  async findOne(id: string): Promise<User> {
    if (!validate(id)) {
      throw new BadRequestException(ErrorCode.INVALID_UUID);
    }

    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
    }

    return plainToInstance(User, user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(createUserDto);
    return plainToInstance(User, user);
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    if (!validate(id)) {
      throw new BadRequestException(ErrorCode.INVALID_UUID);
    }

    try {
      const user = await this.userRepository.update(id, updatePasswordDto);
      return plainToInstance(User, user);
    } catch (error) {
      if (error instanceof DomainException) {
        throw convertDomainExceptionToHttp(error);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException(ErrorCode.INVALID_UUID);
    }

    try {
      await this.userRepository.delete(id);
    } catch (error) {
      if (error instanceof DomainException) {
        throw convertDomainExceptionToHttp(error);
      }
      throw error;
    }
  }
}
