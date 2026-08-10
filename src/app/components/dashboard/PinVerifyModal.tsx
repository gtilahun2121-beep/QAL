'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import PinSession from '@/app/services/pinSession';
import { Language } from '@/i18n/config';

interface PinVerifyModalProps {
  open: boolean;
  userId: string;
  phoneNumber: string;
  lang: Language;
  title?: string;
  description?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const t = (lang: Language, en: string, am: string) => (lang === 'en' ? en : am);

export default function PinVerifyModal({
  open,
  userId,
  phoneNumber,
  lang,
  title,
  description,
  onSuccess,
  onCancel,
}: PinVerifyModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState(PinSession.MAX_ATTEMPTS);
  const [lockedFor, setLockedFor] = useState(0);
  const pinRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setPin('');
    setError('');
    setRemaining(PinSession.remainingAttempts(userId));
    const locked = PinSession.lockRemainingMs(userId);
    setLockedFor(locked);
  }, [open, userId]);

  // Refresh the lockout countdown while locked.
  useEffect(() => {
    if (!open || lockedFor <= 0) return;
    const interval = setInterval(() => {
      setLockedFor(PinSession.lockRemainingMs(userId));
    }, 1000);
    return () => clearInterval(interval);
  }, [open, lockedFor, userId]);

  const isLocked = lockedFor > 0;

  // Focus the input shortly after the modal appears.
  useEffect(() => {
    if (open && !isLocked) {
      const timeout = setTimeout(() => pinRef.current?.focus(), 200);
      return () => clearTimeout(timeout);
    }
  }, [open, isLocked]);

  const lockLabel = useMemo(() => {
    const total = Math.max(0, Math.ceil(lockedFor / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [lockedFor]);

  if (!open) return null;

  const handleVerify = () => {
    if (PinSession.isLocked(userId)) {
      setError(
        t(
          lang,
          'Too many attempts. Account temporarily locked.',
          'ብዙ ሙከራዎች ነበሩ። መለያ ለጊዜው ተቆልፏል።'
        )
      );
      setLockedFor(PinSession.lockRemainingMs(userId));
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      setError(t(lang, 'PIN must be exactly 4 digits', 'PIN በትክክል 4 አሃዝ መሆን አለበት'));
      return;
    }

    const storedPin = PinSession.getUserPin(phoneNumber);
    if (storedPin === null) {
      setError(
        t(
          lang,
          'No PIN stored on this device. Use "Forgot PIN" to recover your account.',
          'በዚህ መሳሪያ ላይ PIN የለም። መለያዎን ለማግኘት "PIN መርሳት" ይጠቀሙ።'
        )
      );
      return;
    }

    if (pin === storedPin) {
      PinSession.reset(userId);
      setPin('');
      onSuccess();
      return;
    }

    const result = PinSession.registerFailure(userId);
    setPin('');
    setRemaining(result.remaining);
    setLockedFor(result.locked ? PinSession.lockRemainingMs(userId) : 0);

    if (result.locked) {
      setError(
        t(
          lang,
          'PIN incorrect. Account locked for 5 minutes.',
          'PIN ትክክል አይደለም። መለያ ለ5 ደቂቃ ተቆልፏል።'
        )
      );
    } else {
      setError(
        t(
          lang,
          `Incorrect PIN. ${result.remaining} attempt(s) remaining.`,
          `የተሳሳተ PIN። ${result.remaining} ሙከራ ይቀራል።`
        )
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      onClick={() => isLocked && onCancel()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-black text-gray-900">
            {title || (lang === 'en' ? 'Confirm Your PIN' : 'PINዎን ያረጋግጡ')}
          </h3>
          <button
            onClick={onCancel}
            className="text-2xl text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {isLocked ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">🔒</div>
            <p className="font-bold text-gray-900 mb-1">
              {t(lang, 'Account Temporarily Locked', 'መለያ ለጊዜው ተቆልፏል')}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {t(
                lang,
                'Too many incorrect PIN attempts. Try again in',
                'በጣም ብዙ የተሳሳቱ PIN ሙከራዎች። በድጋሚ ይሞክሩ'
              )}
            </p>
            <p className="text-3xl font-black text-[#16357a] tabular-nums">{lockLabel}</p>
            <p className="text-xs text-gray-500 mt-3">
              {t(lang, 'Maximum of 3 PIN attempts allowed', 'ቢበዛ 3 PIN ሙከራዎች ተፈቅደዋል')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                4-Digit Security PIN
              </label>
              <input
                ref={pinRef}
                type="password"
                inputMode="numeric"
                value={pin}
                maxLength={4}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerify();
                }}
                placeholder="••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#16357a] font-bold text-3xl text-center tracking-widest"
              />
            </div>

            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">
                {t(lang, 'Attempts remaining:', 'የቀሩ ሙከራዎች:')}
              </p>
              <div className="flex gap-1">
                {Array.from({ length: PinSession.MAX_ATTEMPTS }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i < remaining ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700">{remaining} / 3</span>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 text-sm p-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
              >
                {t(lang, 'Cancel', 'ሰርዝ')}
              </button>
              <button
                onClick={handleVerify}
                className="flex-1 px-4 py-3 bg-[#16357a] text-white font-bold rounded-lg hover:bg-[#27487f] transition-all"
              >
                {t(lang, 'Verify', 'አረጋግጥ')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}