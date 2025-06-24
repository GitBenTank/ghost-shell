// src/hooks/useSoundEffect.js
import { useCallback } from 'react';

export default function useSoundEffect(path) {
  return useCallback(() => {
    const audio = new Audio(path);
    audio.volume = 0.5; // optional: adjust volume
    audio.play().catch((err) => {
      console.warn(`Autoplay blocked or error playing sound (${path}):`, err);
    });
  }, [path]);
}
