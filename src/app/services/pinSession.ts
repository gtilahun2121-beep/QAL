/**
 * PIN Session Service
 * Enforces a maximum of 3 failed PIN attempts followed by a lockout window.
 * Attempt data is persisted per user in localStorage and shared across the
 * dashboard drawer, sensitive actions, and the login/PIN flows.
 */

export const MAX_PIN_ATTEMPTS = 3;
export const PIN_LOCKOUT_MS = 5 * 60 * 1000;

interface PinAttemptRecord {
  failed: number;
  lockedUntil: number;
}

const STORAGE_PREFIX = 'qalnet_pin_attempts_';

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

function load(userId: string): PinAttemptRecord {
  if (typeof window === 'undefined') return { failed: 0, lockedUntil: 0 };
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (raw) {
      const rec = JSON.parse(raw) as PinAttemptRecord;
      return {
        failed: Number(rec.failed) || 0,
        lockedUntil: Number(rec.lockedUntil) || 0,
      };
    }
  } catch (error) {
    console.error('Failed to load PIN attempts:', error);
  }
  return { failed: 0, lockedUntil: 0 };
}

function save(userId: string, record: PinAttemptRecord): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(record));
  } catch (error) {
    console.error('Failed to save PIN attempts:', error);
  }
}

export const PinSession = {
  MAX_ATTEMPTS: MAX_PIN_ATTEMPTS,
  LOCKOUT_MS: PIN_LOCKOUT_MS,

  isLocked(userId: string): boolean {
    return this.lockRemainingMs(userId) > 0;
  },

  lockRemainingMs(userId: string): number {
    const rec = load(userId);
    return Math.max(0, rec.lockedUntil - Date.now());
  },

  remainingAttempts(userId: string): number {
    const rec = load(userId);
    if (rec.lockedUntil > Date.now()) return 0;
    // Lockout expired - let the user start over with a fresh window.
    if (rec.failed >= MAX_PIN_ATTEMPTS) {
      save(userId, { failed: 0, lockedUntil: 0 });
      return MAX_PIN_ATTEMPTS;
    }
    return MAX_PIN_ATTEMPTS - rec.failed;
  },

  registerFailure(userId: string): { remaining: number; locked: boolean } {
    const rec = load(userId);
    const failed = rec.failed + 1;

    if (failed >= MAX_PIN_ATTEMPTS) {
      save(userId, { failed, lockedUntil: Date.now() + PIN_LOCKOUT_MS });
      return { remaining: 0, locked: true };
    }

    save(userId, { failed, lockedUntil: 0 });
    return { remaining: MAX_PIN_ATTEMPTS - failed, locked: false };
  },

  reset(userId: string): void {
    save(userId, { failed: 0, lockedUntil: 0 });
  },

  /**
   * Look up the member's stored PIN across the local flows used by this app
   * (AuthContext mirror in `qalnet_user` and the legacy `qalnet_user_<phone>`
   * registration flow). Returns null when no PIN is available on this device.
   */
  getUserPin(phoneNumber: string): string | null {
    if (typeof window === 'undefined') return null;
    const candidates = [
      `qalnet_user_${phoneNumber}`,
      'qalnet_user',
    ];
    for (const key of candidates) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const user = JSON.parse(raw);
        if (user && typeof user.pin === 'string' && /^\d{4}$/.test(user.pin)) {
          return user.pin;
        }
      } catch (error) {
        console.warn(`Failed to read PIN store (${key}):`, error);
      }
    }
    return null;
  },
};

export default PinSession;