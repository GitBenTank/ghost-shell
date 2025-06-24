// src/components/BootScreen.jsx
import React, { useEffect } from 'react';
import TypewriterText from './TypewriterText.jsx';
import useSoundEffect from '../hooks/useSoundEffect';
import CommandParser from './CommandParser.js';

export default function BootScreen({ onBoot }) {
  // grab the same intro text your shell uses
  const introText = CommandParser('intro').output.trim();
  // play your intro-modem wav
  const playIntro = useSoundEffect('/sounds/intro_modem.wav');
  const speed = 30;         // ms per character
  const cushion = 500;      // extra ms after typing

  useEffect(() => {
    playIntro();
    const total = introText.length * speed + cushion;
    const timer = setTimeout(onBoot, total);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="boot-screen" onClick={onBoot}>
      <TypewriterText text={introText} speed={speed} />
    </div>
  );
}
