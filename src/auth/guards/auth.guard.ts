import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface TokenPayload {
  userId: string;
  login: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly publicRoutes = [
    '/auth/signup',
    '/auth/login',
    '/auth/refresh',
    '/',
    '/doc',
  ];

  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const url = request.url.split('?')[0];

    if (this.isPublicRoute(url)) {
      return true;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Authorization header must follow Bearer scheme',
      );
    }

    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: process.env.JWT_SECRET_KEY || 'test-secret-key',
      });

      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  private isPublicRoute(url: string): boolean {
    if (this.publicRoutes.includes(url)) {
      return true;
    }

    if (url.startsWith('/doc')) {
      return true;
    }

    return false;
  }
}
