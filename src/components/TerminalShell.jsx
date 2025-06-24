// src/components/TerminalShell.jsx
import React, { useState, useRef, useEffect } from 'react'
import CommandParser from './CommandParser'
import TypewriterText from './TypewriterText'
import '../terminal.css'
import useSoundEffect from '../hooks/useSoundEffect'

export default function TerminalShell() {
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [isFading, setIsFading] = useState(false)
  const inputRef = useRef(null)

  // === Sound Effects ===
  const playKeystroke = useSoundEffect('/sounds/keystroke.wav')
  const playEnter      = useSoundEffect('/sounds/enter.wav')
  const playError      = useSoundEffect('/ounds/error_beep.wav')
  const playGlitch     = useSoundEffect('/sounds/glitch_sweep.wav')
  const playDisk       = useSoundEffect('/sounds/disk_seek.wav')
  const playIntro      = useSoundEffect('/sounds/intro_modem.wav')

  // Always keep focus on the hidden input
  useEffect(() => {
    inputRef.current?.focus()
  }, [isFading])

  function handleKeyDown(e) {
    const key = e.key

    // ENTER: run the command
    if (key === 'Enter') {
      e.preventDefault()
      const trimmed = input.trim()

      // parse & play any special action
      const { output, action } = CommandParser(trimmed)

      switch (action) {
        case 'CLEAR_HISTORY':
          playGlitch()
          setIsFading(true)
          setTimeout(() => {
            setHistory([])
            setIsFading(false)
          }, 300)
          break
        case 'PLAY_ERROR':
          playError()
          break
        case 'PLAY_INTRO':
          playIntro()
          break
        default:
          if (trimmed) playDisk()
      }

      // push command + output
      setHistory(h => [...h, `> ${trimmed}`, output])
      setInput('')
      playEnter()
    }

    // BACKSPACE: default editing + sound
    else if (key === 'Backspace') {
      playKeystroke()
    }

    // Any printable character: default editing + sound
    else if (key.length === 1) {
      playKeystroke()
    }
  }

  return (
    <div className="terminal-shell">
      {history.map((entry, i) =>
        typeof entry === 'string' ? (
          <pre key={i} className={isFading ? 'fade-out' : ''}>
            {entry}
          </pre>
        ) : (
          <TypewriterText key={i} text={entry.text} />
        )
      )}

      <pre className="prompt-line">
        <span className="prompt-symbol">user@ghost ~% </span>
        <input
          ref={inputRef}
          className="terminal-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <span className="blinking-cursor" />
      </pre>
    </div>
  )
}
