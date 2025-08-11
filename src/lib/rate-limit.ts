import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import { NextRequest, NextResponse } from 'next/server';

// Different rate limiters for different endpoint types
const rateLimiters = {
  // General API endpoints - 100 requests per minute
  api: new RateLimiterMemory({
    points: 100,
    duration: 60,
    blockDuration: 60,
  }),
  
  // Auth endpoints - 5 attempts per 15 minutes
  auth: new RateLimiterMemory({
    points: 5,
    duration: 900,
    blockDuration: 900,
  }),
  
  // Form submissions - 10 per hour
  submission: new RateLimiterMemory({
    points: 10,
    duration: 3600,
    blockDuration: 3600,
  }),
  
  // Admin endpoints - 200 requests per minute
  admin: new RateLimiterMemory({
    points: 200,
    duration: 60,
    blockDuration: 60,
  }),
};

export type RateLimitType = keyof typeof rateLimiters;

export async function rateLimit(
  req: NextRequest,
  type: RateLimitType = 'api'
): Promise<NextResponse | null> {
  try {
    const identifier = req.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimiter = rateLimiters[type];
    
    await rateLimiter.consume(identifier);
    return null; // Request allowed
  } catch (rateLimiterRes) {
    const res = rateLimiterRes as RateLimiterRes;
    
    return NextResponse.json(
      {
        error: 'Too many requests',
        retryAfter: Math.round(res.msBeforeNext / 1000) || 60,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.round(res.msBeforeNext / 1000) || 60),
          'X-RateLimit-Limit': String(rateLimiters[type].points),
          'X-RateLimit-Remaining': String(res.remainingPoints || 0),
          'X-RateLimit-Reset': new Date(Date.now() + res.msBeforeNext).toISOString(),
        },
      }
    );
  }
}

// Hono middleware wrapper
export function createRateLimitMiddleware(type: RateLimitType = 'api') {
  return async (c: any, next: any) => {
    const req = new NextRequest(c.req.url, {
      headers: c.req.raw.headers,
    });
    
    const rateLimitResponse = await rateLimit(req, type);
    
    if (rateLimitResponse) {
      return c.json(
        { error: 'Too many requests' },
        429,
        Object.fromEntries(rateLimitResponse.headers.entries())
      );
    }
    
    await next();
  };
}
