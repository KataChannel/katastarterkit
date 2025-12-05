/**
 * RAG Rate Limit Guard - Giới hạn số lượng request
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RagConfigService } from '../services/rag-config.service';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable()
export class RagRateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RagRateLimitGuard.name);
  private minuteLimit: Map<string, RateLimitEntry> = new Map();
  private hourLimit: Map<string, RateLimitEntry> = new Map();

  constructor(private readonly ragConfigService: RagConfigService) {
    // Cleanup expired entries every minute
    setInterval(() => this.cleanupExpiredEntries(), 60000);
  }

  canActivate(context: ExecutionContext): boolean {
    // Get request
    let request: any;
    try {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    } catch {
      request = context.switchToHttp().getRequest();
    }

    // Get client identifier (user ID or IP)
    const clientId = this.getClientId(request);
    const now = Date.now();

    // Check minute limit
    const minuteLimit = this.ragConfigService.getSetting('rateLimitPerMinute');
    if (!this.checkLimit(clientId, this.minuteLimit, minuteLimit, 60000, now)) {
      this.logger.warn(`Rate limit exceeded (minute) for client: ${clientId}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Quá nhiều yêu cầu. Vui lòng đợi 1 phút.',
          error: 'Too Many Requests',
          retryAfter: Math.ceil((this.minuteLimit.get(clientId)!.resetTime - now) / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Check hour limit
    const hourLimit = this.ragConfigService.getSetting('rateLimitPerHour');
    if (!this.checkLimit(clientId, this.hourLimit, hourLimit, 3600000, now)) {
      this.logger.warn(`Rate limit exceeded (hour) for client: ${clientId}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Quá nhiều yêu cầu. Vui lòng đợi và thử lại sau.',
          error: 'Too Many Requests',
          retryAfter: Math.ceil((this.hourLimit.get(clientId)!.resetTime - now) / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private getClientId(request: any): string {
    // Prefer user ID if authenticated
    if (request?.user?.id) {
      return `user:${request.user.id}`;
    }

    // Fall back to IP address
    const ip = request?.ip || 
               request?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
               request?.connection?.remoteAddress ||
               'unknown';

    return `ip:${ip}`;
  }

  private checkLimit(
    clientId: string,
    limitMap: Map<string, RateLimitEntry>,
    maxRequests: number,
    windowMs: number,
    now: number,
  ): boolean {
    const entry = limitMap.get(clientId);

    // If no entry or expired, create new
    if (!entry || now >= entry.resetTime) {
      limitMap.set(clientId, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    // If under limit, increment
    if (entry.count < maxRequests) {
      entry.count++;
      return true;
    }

    // Over limit
    return false;
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.minuteLimit.entries()) {
      if (now >= entry.resetTime) {
        this.minuteLimit.delete(key);
      }
    }

    for (const [key, entry] of this.hourLimit.entries()) {
      if (now >= entry.resetTime) {
        this.hourLimit.delete(key);
      }
    }
  }

  /**
   * Get remaining requests for a client
   */
  getRemainingRequests(request: any): { minute: number; hour: number } {
    const clientId = this.getClientId(request);
    const now = Date.now();

    const minuteEntry = this.minuteLimit.get(clientId);
    const hourEntry = this.hourLimit.get(clientId);

    const minuteLimit = this.ragConfigService.getSetting('rateLimitPerMinute');
    const hourLimit = this.ragConfigService.getSetting('rateLimitPerHour');

    return {
      minute: minuteEntry && now < minuteEntry.resetTime 
        ? Math.max(0, minuteLimit - minuteEntry.count) 
        : minuteLimit,
      hour: hourEntry && now < hourEntry.resetTime 
        ? Math.max(0, hourLimit - hourEntry.count) 
        : hourLimit,
    };
  }

  /**
   * Reset rate limit for a client (Admin only)
   */
  resetRateLimit(clientId: string): void {
    this.minuteLimit.delete(clientId);
    this.hourLimit.delete(clientId);
    this.logger.log(`Rate limit reset for client: ${clientId}`);
  }

  /**
   * Get all rate limit stats (Admin only)
   */
  getRateLimitStats(): {
    totalClients: number;
    minuteLimitClients: number;
    hourLimitClients: number;
  } {
    return {
      totalClients: new Set([...this.minuteLimit.keys(), ...this.hourLimit.keys()]).size,
      minuteLimitClients: this.minuteLimit.size,
      hourLimitClients: this.hourLimit.size,
    };
  }
}
