const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

interface LoginAttempt {
  count: number;
  lockedUntil: number | null;
}

const attempts = new Map<string, LoginAttempt>();

export const recordFailedLogin = (email: string) => {
  const attempt = attempts.get(email) || { count: 0, lockedUntil: null };
  attempt.count++;

  if (attempt.count >= MAX_ATTEMPTS) {
    attempt.lockedUntil = Date.now() + LOCKOUT_DURATION;
  }

  attempts.set(email, attempt);
};

export const isAccountLocked = (email: string): boolean => {
  const attempt = attempts.get(email);
  if (!attempt?.lockedUntil) return false;

  if (Date.now() > attempt.lockedUntil) {
    attempts.delete(email);
    return false;
  }

  return true;
};

export const clearLoginAttempts = (email: string) => {
  attempts.delete(email);
};
