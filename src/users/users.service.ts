import { Injectable, Inject } from '@nestjs/common';
import { validate } from 'uuid';
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
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User> {
    if (!validate(id)) {
      throw new BadRequestException(ErrorCode.INVALID_UUID);
    }

    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(ErrorCode.USER_NOT_FOUND);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    if (!validate(id)) {
      throw new BadRequestException(ErrorCode.INVALID_UUID);
    }

    try {
      return await this.userRepository.update(id, updatePasswordDto);
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
