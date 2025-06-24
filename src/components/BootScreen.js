import React, { useEffect } from 'react';

export default function BootScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <pre className="terminal-shell">
{`*** GHOST SHELL BIOS v1.0 ***
Copyright 1984 CTRL+Strum
Booting from /dev/shell0...
.
Mounting memory sectors...
Initializing modules...
.
Welcome, visitor...`}
    </pre>
  );
}
