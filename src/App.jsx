// src/App.jsx
import React, { useState } from 'react';
import BootScreen from './components/BootScreen.jsx';
import TerminalShell from './components/TerminalShell.jsx';
import './terminal.css';

function App() {
  const [booted, setBooted] = useState(false);

  return booted
    ? <TerminalShell />
    : <BootScreen onBoot={() => setBooted(true)} />;
}

export default App;
