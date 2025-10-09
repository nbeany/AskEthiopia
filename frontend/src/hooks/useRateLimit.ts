import { useState, useCallback } from 'react';

interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
  lockoutMs: number;
}

export const useRateLimit = (options: RateLimitOptions) => {
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lastAttempt, setLastAttempt] = useState<number>(0);

  const checkLimit = useCallback((): { allowed: boolean; remainingTime?: number } => {
    const now = Date.now();
    
    // Check if still locked out
    if (lockedUntil && now < lockedUntil) {
      return { 
        allowed: false, 
        remainingTime: Math.ceil((lockedUntil - now) / 1000) 
      };
    }

    // Reset if window has passed
    if (now - lastAttempt > options.windowMs) {
      setAttempts(0);
      setLockedUntil(null);
    }

    return { allowed: true };
  }, [attempts, lockedUntil, lastAttempt, options.windowMs]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    setLastAttempt(now);
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Lock if max attempts reached
    if (newAttempts >= options.maxAttempts) {
      const lockUntil = now + options.lockoutMs;
      setLockedUntil(lockUntil);
      setAttempts(0);
    }
  }, [attempts, options.maxAttempts, options.lockoutMs]);

  const reset = useCallback(() => {
    setAttempts(0);
    setLockedUntil(null);
    setLastAttempt(0);
  }, []);

  return { checkLimit, recordAttempt, reset, attempts };
};
