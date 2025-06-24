// src/components/TerminalShell.jsx
import React, { useState, useRef, useEffect } from 'react';
import CommandParser from './CommandParser';
import TypewriterText from './TypewriterText';
import '../terminal.css';
import useSoundEffect from '../hooks/useSoundEffect';

export default function TerminalShell() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isFading, setIsFading] = useState(false);
  const inputRef = useRef(null);

  // === Sound Effects ===
  const playKeystroke = useSoundEffect('/sounds/keystroke.wav');
  const playEnter      = useSoundEffect('/sounds/enter.wav');
  const playError      = useSoundEffect('/ounds/error_beep.wav');
  const playGlitch     = useSoundEffect('/sounds/glitch_sweep.wav');
  const playDisk       = useSoundEffect('/sounds/disk_seek.wav');
  const playIntro      = useSoundEffect('/sounds/intro_modem.wav');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = input.trim();
      const { output, action } = CommandParser(trimmed);

      // play the appropriate sound for this action
      switch (action) {
        case 'CLEAR_HISTORY':
          playGlitch();
          setIsFading(true);
          setTimeout(() => {
            setHistory([]);
            setIsFading(false);
          }, 300);
          break;
        case 'PLAY_ERROR':
          playError();
          break;
        case 'PLAY_INTRO':
          playIntro();
          break;
        default:
          if (trimmed) playDisk();
      }

      // record it in the history
      setHistory((prev) => [...prev, `> ${trimmed}`, output]);
      setInput('');
      playEnter();
    }
    else if (e.key.length === 1 || e.key === 'Backspace') {
      // just play a keystroke sound; let onChange handle the actual text
      playKeystroke();
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="terminal">
      {history.map((entry, i) =>
        typeof entry === 'string' ? (
          <pre key={i} className={isFading ? 'fading' : ''}>
            {entry}
          </pre>
        ) : (
          <TypewriterText key={i} text={entry.text} />
        )
      )}
      <pre>
        <span className="prompt">user@ghost ~% </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="terminal-input"
        />
      </pre>
    </div>
  );
}
