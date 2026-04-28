/**
 * Limitation
 * This implementation uses an in-memory store, which works correctly in a single-instance environment.
 * However, in a serverless/edge deployment (e.g., Vercel), instances are stateless and not shared, 
 * which can lead to inconsistent rate limiting.
 *
 * Production alternative
 * In production, this would be replaced with a distributed store such as Redis or Vercel KV 
 * to ensure consistent behavior across instances.
 *
 * Why I chose this approach
 * I intentionally implemented a custom in-memory rate limiter to demonstrate understanding 
 * of the algorithm and control over behavior, rather than relying on external libraries.
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

const LIMIT = 10;
const WINDOW_MS = 60 * 1000; // 1 minute

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();

  const record = store[key];

  // Reset window
  if (!record || now > record.resetTime) {
    store[key] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };

    return {
      success: true,
      limit: LIMIT,
      remaining: LIMIT - 1,
      reset: store[key].resetTime,
    };
  }

  // Within limit
  if (record.count < LIMIT) {
    record.count++;

    return {
      success: true,
      limit: LIMIT,
      remaining: LIMIT - record.count,
      reset: record.resetTime,
    };
  }

  // Rate limit exceeded
  return {
    success: false,
    limit: LIMIT,
    remaining: 0,
    reset: record.resetTime,
  };
}