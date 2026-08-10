'use client';

import { useEffect, useRef, useState } from 'react';
import {
  getProfilePhoto,
  PROFILE_PHOTO_EVENT,
  fileToProfilePhoto,
  setProfilePhoto,
  removeProfilePhoto,
} from '@/app/services/profilePhoto';

interface ProfileAvatarProps {
  uid: string;
  name: string;
  size?: number;
  editable?: boolean;
  onPhotoChange?: () => void;
}

/**
 * User avatar that shows the stored profile photo, falling back to initials.
 * When `editable` is set, a camera overlay lets the member upload/remove their photo.
 */
export default function ProfileAvatar({ uid, name, size = 40, editable = false, onPhotoChange }: ProfileAvatarProps) {
  const [photo, setPhoto] = useState<string | null>(() => getProfilePhoto(uid));
  const [hover, setHover] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sync = () => setPhoto(getProfilePhoto(uid));
    window.addEventListener(PROFILE_PHOTO_EVENT, sync);
    return () => window.removeEventListener(PROFILE_PHOTO_EVENT, sync);
  }, [uid]);

  const initials = (name || 'U')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const dot = size * 0.45;

  const handlePick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToProfilePhoto(file);
      setProfilePhoto(uid, dataUrl);
      onPhotoChange?.();
    } catch {
      // ignore unreadable files
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={name}
          className="rounded-full object-cover w-full h-full"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="rounded-full bg-gradient-to-br from-teal-500 to-purple-600 text-white flex items-center justify-center font-black"
          style={{ width: size, height: size, fontSize: Math.max(10, dot * 0.5) }}
        >
          {initials || 'M'}
        </div>
      )}

      {editable && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePick(e.target.files?.[0])}
          />
          {busy ? (
            <span
              className="absolute inset-0 rounded-full bg-black/50 text-white flex items-center justify-center"
              style={{ fontSize: Math.max(8, dot * 0.4) }}
            >
              …
            </span>
          ) : (
            hover && (
              <span className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center text-white">
                <span
                  className="absolute bottom-0 right-0 bg-white rounded-full flex items-center justify-center shadow"
                  style={{ width: dot, height: dot }}
                >
                  <svg className="text-gray-800" style={{ width: dot * 0.55, height: dot * 0.55 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </span>
            )
          )}
          {hover && (
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute inset-0 rounded-full cursor-pointer"
              aria-label="Change profile photo"
            />
          )}
        </>
      )}

      {editable && photo && (
        <button
          onClick={() => removeProfilePhoto(uid)}
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow hover:bg-red-700 transition-all"
          aria-label="Remove profile photo"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <span
        onMouseEnter={() => editable && setHover(true)}
        onMouseLeave={() => editable && setHover(false)}
        className={editable ? 'absolute inset-0 rounded-full' : 'hidden'}
      />
    </div>
  );
}