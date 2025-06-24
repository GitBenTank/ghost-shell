import React, { useState, useRef, useEffect } from 'react';
import CommandParser from './CommandParser';
import TypewriterText from './TypewriterText';
import "../terminal.css";
import useSoundEffect from '../hooks/useSoundEffect';

export default function TerminalShell() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isFading, setIsFading] = useState(false);
  const [insertedProgram, setInsertedProgram] = useState(null);
  const inputRef = useRef(null);

  // === Sound Effects ===
  const playKeystroke = useSoundEffect("/sounds/keystroke.wav");
  const playEnter = useSoundEffect("/sounds/enter.wav");
  const playError = useSoundEffect("/sounds/error_beep.wav");
  const playGlitch = useSoundEffect("/sounds/glitch_sweep.wav");
  const playDisk = useSoundEffect("/sounds/disk_seek.wav");
  const playIntro = useSoundEffect("/sounds/intro_modem.wav");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInput = (e) => {
    if (e.key === 'Enter') {
      const trimmed = input.trim();
      const { output, action, data } = CommandParser(trimmed, insertedProgram);

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
        case 'INSERT_FLOPPY':
          playDisk();
          setInsertedProgram(null);
          break;
        case 'LOAD_PROGRAM':
          playDisk();
          setInsertedProgram(data); // e.g., 'ghost_maze'
          break;
        case 'LAUNCH_PROGRAM':
          playDisk();
          break;
        default:
          break;
      }

      setHistory(prev => [...prev, `> ${trimmed}`, output]);
      setInput('');
      playEnter();
    }

    else if (e.key.length === 1) {
      setInput(prev => prev + e.key);
      playKeystroke();
    }

    else if (e.key === 'Backspace') {
      setInput(prev => prev.slice(0, -1));
      playKeystroke();
    }
  };

  return (
    <div className="terminal">
      {history.map((entry, i) =>
        typeof entry === 'string' ? (
          <pre key={i} className={isFading ? 'fading' : ''}>{entry}</pre>
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
          onKeyDown={handleInput}
          className="terminal-input"
        />
      </pre>
    </div>
  );
}
