// src/components/TypewriterText.jsx
import React, { useState, useEffect } from 'react';
import useSoundEffect from '../hooks/useSoundEffect';

export default function TypewriterText({ text }) {
  const [displayedText, setDisplayedText] = useState('');
  const playKeystroke = useSoundEffect('/sounds/keystroke.wav');

  useEffect(() => {
    if (!text) return;

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      playKeystroke();
      index++;

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, playKeystroke]);

  return <pre>{displayedText}</pre>;
}
