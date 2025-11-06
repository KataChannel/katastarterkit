/**
 * Redis Client for Next.js
 * Caching and session storage
 */

import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as {
  redis: Redis | null | undefined
}

// Check if Redis is enabled via environment variable
const isRedisEnabled = process.env.ENABLE_REDIS === 'true'

export const redis = isRedisEnabled
  ? (globalForRedis.redis ??
    new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 1, // Reduce retries to fail faster
      retryStrategy(times) {
        if (times > 1) return null // Stop retrying after 1 attempt
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      reconnectOnError(err) {
        // Don't reconnect on errors during development
        return false
      },
      lazyConnect: true, // Don't connect immediately
    }))
  : null

if (process.env.NODE_ENV !== 'production' && redis) {
  globalForRedis.redis = redis
}

if (redis) {
  redis.on('connect', () => {
    console.log('✅ Redis connected')
  })

  redis.on('error', (err) => {
    console.error('❌ Redis error:', err.message)
    // Don't throw, just log
  })

  // Try to connect, but don't fail if it doesn't work
  redis.connect().catch((err) => {
    console.warn('⚠️ Redis not available, caching disabled:', err.message)
  })
}

if (!isRedisEnabled) {
  console.log('ℹ️ Redis disabled. Set ENABLE_REDIS=true in .env to enable caching.')
}

// Cache helpers
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (!redis) return null
    try {
      const value = await redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.warn('Cache get error:', error)
      return null
    }
  },

  async set(key: string, value: any, expirySeconds?: number): Promise<void> {
    if (!redis) return
    try {
      const serialized = JSON.stringify(value)
      if (expirySeconds) {
        await redis.setex(key, expirySeconds, serialized)
      } else {
        await redis.set(key, serialized)
      }
    } catch (error) {
      console.warn('Cache set error:', error)
    }
  },

  async del(key: string): Promise<void> {
    if (!redis) return
    try {
      await redis.del(key)
    } catch (error) {
      console.warn('Cache del error:', error)
    }
  },

  async exists(key: string): Promise<boolean> {
    if (!redis) return false
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (error) {
      console.warn('Cache exists error:', error)
      return false
    }
  },

  async invalidatePattern(pattern: string): Promise<void> {
    if (!redis) return
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.warn('Cache invalidatePattern error:', error)
    }
  },
}
