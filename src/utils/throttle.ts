import redis from './redis'

/**
 * Vérifie et incrémente le compteur de throttling pour une clé donnée (ex: login:throttle:ip).
 * @param key Clé Redis (ex: login:throttle:ip:127.0.0.1)
 * @param limit Nombre max de tentatives autorisées dans la fenêtre
 * @param windowSec Durée de la fenêtre en secondes
 * @returns { allowed: boolean; retryAfter?: number }
 */
export async function checkAndIncrementThrottle(
  key: string,
  limit: number,
  windowSec: number,
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const count = await redis.incr(key)
  if (count === 1) {
    await redis.expire(key, windowSec)
  }
  if (count > limit) {
    const ttl = await redis.ttl(key)
    return { allowed: false, retryAfter: ttl > 0 ? ttl : windowSec }
  }
  return { allowed: true }
}
