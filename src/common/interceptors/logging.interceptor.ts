import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url, query, body } = request;
    const startTime = Date.now();

    this.loggingService.log(
      `Incoming request: ${method} ${url}${query && Object.keys(query).length > 0 ? `?${new URLSearchParams(query as Record<string, string>).toString()}` : ''}${body && Object.keys(body).length > 0 ? ` Body: ${JSON.stringify(body)}` : ''}`,
      'LoggingInterceptor',
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = response;
          const responseTime = Date.now() - startTime;

          this.loggingService.log(
            `Outgoing response: ${method} ${url} - ${statusCode} (${responseTime}ms)`,
            'LoggingInterceptor',
          );
        },
        error: (error) => {
          const { statusCode } = response;
          const responseTime = Date.now() - startTime;

          this.loggingService.error(
            `Outgoing response: ${method} ${url} - ${statusCode} (${responseTime}ms) - Error: ${error.message || 'Unknown error'}`,
            'LoggingInterceptor',
          );
        },
      }),
    );
  }
}
