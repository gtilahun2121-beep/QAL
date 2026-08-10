'use client';

const KEY = (uid: string) => `qalnet_profile_photo_${uid}`;

export const PROFILE_PHOTO_EVENT = 'qalnet-profile-photo-change';

export function getProfilePhoto(uid: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(KEY(uid));
  } catch {
    return null;
  }
}

export function setProfilePhoto(uid: string, dataUrl: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY(uid), dataUrl);
    window.dispatchEvent(new CustomEvent(PROFILE_PHOTO_EVENT, { detail: { uid } }));
  } catch {
    return;
  }
}

export function removeProfilePhoto(uid: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(KEY(uid));
    window.dispatchEvent(new CustomEvent(PROFILE_PHOTO_EVENT, { detail: { uid } }));
  } catch {
    return;
  }
}

/**
 * Reads an image file, downscales it to a square thumbnail (max `maxSize` px)
 * and returns a JPEG data URL for storage in localStorage.
 */
export function fileToProfilePhoto(file: File, maxSize = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        const scale = Math.min(1, maxSize / size);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(size * scale);
        canvas.height = Math.round(size * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        ctx.drawImage(img, sx, sy, size, size, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}