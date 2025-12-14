import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../users/repositories/user.repository.interface';
import { User } from '../users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  BadRequestException,
  ForbiddenException,
  ErrorCode,
} from '../common/errors';
import { TokenPayload } from './guards/auth.guard';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
    const existingUser = await this.userRepository.findByLogin(signupDto.login);
    if (existingUser) {
      throw new BadRequestException(
        ErrorCode.MISSING_REQUIRED_FIELDS,
        'User with this login already exists',
      );
    }

    const createUserDto: CreateUserDto = {
      login: signupDto.login,
      password: signupDto.password,
    };

    return this.userRepository.create(createUserDto);
  }

  async login(loginDto: LoginDto): Promise<TokenResponse> {
    const user = await this.userRepository.findByLogin(loginDto.login);

    if (!user) {
      throw new ForbiddenException(
        ErrorCode.WRONG_OLD_PASSWORD,
        'Invalid login or password',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException(
        ErrorCode.WRONG_OLD_PASSWORD,
        'Invalid login or password',
      );
    }

    return this.generateTokens(user);
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<TokenResponse> {
    if (!refreshTokenDto.refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = this.jwtService.verify<TokenPayload>(
        refreshTokenDto.refreshToken,
        {
          secret:
            process.env.JWT_SECRET_REFRESH_KEY || 'test-refresh-secret-key',
        },
      );

      const user = await this.userRepository.findOne(payload.userId);
      if (!user) {
        throw new ForbiddenException(
          ErrorCode.USER_NOT_FOUND,
          'User not found',
        );
      }

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException(
        ErrorCode.WRONG_OLD_PASSWORD,
        'Invalid or expired refresh token',
      );
    }
  }

  private generateTokens(user: User): TokenResponse {
    const payload: TokenPayload = {
      userId: user.id,
      login: user.login,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY || 'test-secret-key',
      expiresIn: (process.env.TOKEN_EXPIRE_TIME || '1h') as any,
    } as any);

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY || 'test-refresh-secret-key',
      expiresIn: (process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h') as any,
    } as any);

    return {
      accessToken,
      refreshToken,
    };
  }
}
