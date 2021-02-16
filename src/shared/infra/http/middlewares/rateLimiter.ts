import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 10,
  duration: 1,
});

const limiterConsecutiveOutOfLimits = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'request_consecutive_outoflimits',
  points: 99999,
  duration: 3600,
});

function getFibonacciBlockDurationMinutes(
  countConsecutiveOutOfLimits: number,
): number {
  if (countConsecutiveOutOfLimits <= 1) {
    return 1;
  }

  return (
    getFibonacciBlockDurationMinutes(countConsecutiveOutOfLimits - 1) +
    getFibonacciBlockDurationMinutes(countConsecutiveOutOfLimits - 2)
  );
}

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const userIp = request.ip;

  const resByIp = await limiter.get(userIp);

  let retrySecs = 0;

  if (resByIp !== null && resByIp.remainingPoints <= 0) {
    retrySecs = Math.round(resByIp.msBeforeNext / 1000) || 1;
  }

  if (retrySecs > 0) {
    response.set('Retry-After', String(retrySecs));
    response.status(429).send('Too Many Requests');
  } else {
    try {
      const resConsume = await limiter.consume(userIp);

      if (resConsume.remainingPoints <= 0) {
        const resPenalty = await limiterConsecutiveOutOfLimits.penalty(userIp);
        await limiter.block(
          userIp,
          60 * getFibonacciBlockDurationMinutes(resPenalty.consumedPoints),
        );
      }

      return next();
    } catch (rlRejected) {
      if (rlRejected instanceof Error) {
        throw rlRejected;
      } else {
        response.set(
          'Retry-After',
          String(Math.round(rlRejected.msBeforeNext / 1000)),
        );
        response.status(429).send('Too Many Requests');
      }
    }
  }
}
