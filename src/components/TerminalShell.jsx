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

  // auto-focus whenever this component loads
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInput = (e) => {
    if (e.key === 'Enter') {
      const trimmed = input.trim();
      const { output, action } = CommandParser(trimmed);

      // play the right sound for each action
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

      setHistory((prev) => [...prev, `> ${trimmed}`, output]);
      setInput('');
      playEnter();
    }
    else if (e.key.length === 1) {
      setInput((prev) => prev + e.key);
      playKeystroke();
    }
    else if (e.key === 'Backspace') {
      setInput((prev) => prev.slice(0, -1));
      playKeystroke();
    }
  };

  return (
    // clicking anywhere refocuses the input (great for phones)
    <div
      className="terminal-shell"
      onClick={() => inputRef.current?.focus()}
      style={{ cursor: 'text' }}
    >
      {history.map((entry, i) =>
        typeof entry === 'string' ? (
          <pre key={i} className={isFading ? 'fade-out' : ''}>
            {entry}
          </pre>
        ) : (
          <TypewriterText key={i} text={entry.text} />
        )
      )}

      <div className="prompt-line">
        <span className="prompt-symbol">user@ghost ~% </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInput}
          className="terminal-input"
        />
        <span className="blinking-cursor" />
      </div>
    </div>
  );
}
