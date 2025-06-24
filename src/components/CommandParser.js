// src/components/CommandParser.js

import { launchGhostMaze, ghostMazeInput } from '../games/ghost_maze';

let currentMode = 'shell'; // 'shell' or 'game'
let loadedProgram = null;

export default function CommandParser(command) {
  const trimmed = command.trim();

  // Game mode: route all input to game handler
  if (currentMode === 'game') {
    const output = ghostMazeInput(trimmed);
    return { output, action: null };
  }

  // Shell commands
  switch (trimmed.toLowerCase()) {
    case 'help':
      return {
        output: `Available commands:
- help ............. Show available commands
- intro ............ Play the GHOST SHELL intro message
- about ............ Info about this project
- log .............. View recent system logs
- clear ............ Clear the screen
- contact .......... Reach the creator
- github ........... Open the GitHub repo
- insert floppy .... View available programs to load
- launch ........... Launch inserted program (or default)`,
        action: null
      };

    case 'intro':
      return { output: '👾 INITIATING GHOST SHELL PROTOCOL…', action: 'PLAY_INTRO' };

    case 'about':
      return {
        output: `This terminal is part of PROJECT: GHOST SHELL — an immersive retro terminal experience built with React.
Type 'insert floppy' to explore hidden programs.`
      };

    case 'log':
      return { output: 'System Logs: [ACCESS GRANTED] /lastboot=stable /errors=none /mode=👻' };

    case 'clear':
      return { output: '', action: 'CLEAR_HISTORY' };

    case 'contact':
      return { output: 'Reach out at: ben@ctrlstrum.com' };

    case 'github':
      window.open('https://github.com/GitBenTank', '_blank');
      return { output: 'Opening GitHub repo…' };

    case 'insert floppy':
      loadedProgram = 'ghost_maze';
      return {
        output: `📀 FLOPPY INSERTED

Available programs:
- ghost_maze ........... Haunted maze terminal adventure

Type 'launch' to begin.`,
        action: null
      };

    case 'launch':
      currentMode = 'game';
      if (loadedProgram === 'ghost_maze') {
        const intro = launchGhostMaze();
        return { output: intro };
      } else {
        const intro = launchGhostMaze(); // default to ghost_maze
        return { output: intro };
      }

    default:
      return {
        output: `[ ERROR ] Command not found. Type "help" to see available commands.`,
        action: 'PLAY_ERROR'
      };
  }
}
