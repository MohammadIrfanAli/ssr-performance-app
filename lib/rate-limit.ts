interface RateLimitStore {
  [ip: string]: {
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

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  
  if (!store[ip] || now > store[ip].resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + WINDOW_MS
    };
    return {
      success: true,
      limit: LIMIT,
      remaining: LIMIT - 1,
      reset: store[ip].resetTime
    };
  }
  
  if (store[ip].count < LIMIT) {
    store[ip].count++;
    return {
      success: true,
      limit: LIMIT,
      remaining: LIMIT - store[ip].count,
      reset: store[ip].resetTime
    };
  }
  
  return {
    success: false,
    limit: LIMIT,
    remaining: 0,
    reset: store[ip].resetTime
  };
}
