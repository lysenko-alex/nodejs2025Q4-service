import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User | null>;
  findByLogin(login: string): Promise<User | null>;
  create(createUserDto: CreateUserDto): Promise<User>;
  update(id: string, updatePasswordDto: UpdatePasswordDto): Promise<User>;
  delete(id: string): Promise<void>;
}
