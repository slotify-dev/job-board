import redisService from './redisService';

export interface TokenBucketResult {
  allowed: boolean;
  tokensRemaining: number;
  retryAfter?: number;
}

export interface TokenBucketConfig {
  capacity: number;
  refillRate: number;
  windowMs: number;
}

class RateLimitService {
  private static instance: RateLimitService;

  private constructor() {}

  public static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService();
    }
    return RateLimitService.instance;
  }

  /**
   * Token Bucket Implementation for Rate Limiting
   * Uses Redis for distributed rate limiting across multiple server instances
   */
  public async consumeToken(
    key: string,
    tokens: number = 1,
    config: TokenBucketConfig,
  ): Promise<TokenBucketResult> {
    const { capacity, refillRate, windowMs } = config;

    const script = `
      local key = KEYS[1]
      local capacity = tonumber(ARGV[1])
      local tokens_requested = tonumber(ARGV[2])
      local refill_rate = tonumber(ARGV[3])
      local window_ms = tonumber(ARGV[4])
      local now = tonumber(ARGV[5])
      
      -- Get current bucket state
      local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
      local tokens = tonumber(bucket[1]) or capacity
      local last_refill = tonumber(bucket[2]) or now
      
      -- Calculate tokens to add based on time elapsed
      local time_elapsed = math.max(0, now - last_refill)
      local tokens_to_add = math.floor((time_elapsed / 1000) * (refill_rate / (window_ms / 1000)))
      tokens = math.min(capacity, tokens + tokens_to_add)
      
      -- Check if request can be fulfilled
      if tokens >= tokens_requested then
        tokens = tokens - tokens_requested
        -- Update bucket state
        redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
        redis.call('EXPIRE', key, math.ceil(window_ms / 1000 * 2)) -- TTL to cleanup old keys
        return {1, tokens, 0} -- allowed, tokens_remaining, retry_after
      else
        -- Calculate retry after time
        local tokens_needed = tokens_requested - tokens
        local retry_after = math.ceil((tokens_needed / refill_rate) * (window_ms / 1000))
        -- Update last_refill time but don't consume tokens
        redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
        redis.call('EXPIRE', key, math.ceil(window_ms / 1000 * 2))
        return {0, tokens, retry_after} -- not allowed, tokens_remaining, retry_after
      end
    `;

    try {
      const client = redisService.getClient();
      const result = (await client.eval(script, {
        keys: [key],
        arguments: [
          capacity.toString(),
          tokens.toString(),
          refillRate.toString(),
          windowMs.toString(),
          Date.now().toString(),
        ],
      })) as number[];

      if (!result || result.length < 3) {
        return {
          allowed: true,
          tokensRemaining: capacity,
        };
      }

      return {
        allowed: result[0] === 1,
        tokensRemaining: result[1] || 0,
        retryAfter: result[2] && result[2] > 0 ? result[2] * 1000 : undefined, // Convert to ms
      };
    } catch (error) {
      console.error('Error in token bucket operation:', error);
      // Fail open - allow the request if Redis is down
      return {
        allowed: true,
        tokensRemaining: capacity,
      };
    }
  }

  /**
   * Return tokens to the bucket (useful for skipping requests that shouldn't count)
   */
  public async returnToken(
    key: string,
    tokens: number = 1,
    config: TokenBucketConfig,
  ): Promise<void> {
    const { capacity, refillRate, windowMs } = config;

    const script = `
      local key = KEYS[1]
      local capacity = tonumber(ARGV[1])
      local tokens_to_return = tonumber(ARGV[2])
      local refill_rate = tonumber(ARGV[3])
      local window_ms = tonumber(ARGV[4])
      local now = tonumber(ARGV[5])
      
      -- Get current bucket state
      local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
      local tokens = tonumber(bucket[1]) or capacity
      local last_refill = tonumber(bucket[2]) or now
      
      -- Return tokens to bucket (up to capacity)
      tokens = math.min(capacity, tokens + tokens_to_return)
      
      -- Update bucket state
      redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
      redis.call('EXPIRE', key, math.ceil(window_ms / 1000 * 2))
    `;

    try {
      const client = redisService.getClient();
      await client.eval(script, {
        keys: [key],
        arguments: [
          capacity.toString(),
          tokens.toString(),
          refillRate.toString(),
          windowMs.toString(),
          Date.now().toString(),
        ],
      });
    } catch (error) {
      console.error('Error returning tokens to bucket:', error);
    }
  }

  /**
   * Get current bucket status without consuming tokens
   */
  public async getBucketStatus(
    key: string,
    config: TokenBucketConfig,
  ): Promise<{
    tokensRemaining: number;
    lastRefill: number;
  }> {
    const { capacity, refillRate, windowMs } = config;

    const script = `
      local key = KEYS[1]
      local capacity = tonumber(ARGV[1])
      local refill_rate = tonumber(ARGV[2])
      local window_ms = tonumber(ARGV[3])
      local now = tonumber(ARGV[4])
      
      -- Get current bucket state
      local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
      local tokens = tonumber(bucket[1]) or capacity
      local last_refill = tonumber(bucket[2]) or now
      
      -- Calculate tokens to add based on time elapsed
      local time_elapsed = math.max(0, now - last_refill)
      local tokens_to_add = math.floor((time_elapsed / 1000) * (refill_rate / (window_ms / 1000)))
      tokens = math.min(capacity, tokens + tokens_to_add)
      
      return {tokens, last_refill}
    `;

    try {
      const client = redisService.getClient();
      const result = (await client.eval(script, {
        keys: [key],
        arguments: [
          capacity.toString(),
          refillRate.toString(),
          windowMs.toString(),
          Date.now().toString(),
        ],
      })) as number[];

      return {
        tokensRemaining: result[0] || capacity,
        lastRefill: result[1] || Date.now(),
      };
    } catch (error) {
      console.error('Error getting bucket status:', error);
      return {
        tokensRemaining: capacity,
        lastRefill: Date.now(),
      };
    }
  }
}

const rateLimitService = RateLimitService.getInstance();
export default rateLimitService;
