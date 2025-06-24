// src/gameLoader.js

export function insertFloppy(name) {
    switch (name) {
      case 'ghost_maze':
        return `
  [DISK DRIVE]
  Program "ghost_maze" inserted.
  Type 'launch' to begin.`;
  
      default:
        return `[DISK ERROR] Program "${name}" not found. Type 'insert floppy' to see available games.`;
    }
  }
  
  export function launchGame(name) {
    switch (name) {
      case 'ghost_maze':
        return `
  👻 WELCOME TO GHOST MAZE
  
  You wake in a flickering corridor. Every exit is darkness.
  Type a direction to move: north, south, east, west.
  Type 'exit' to quit the maze.`;
  
      default:
        return `[BOOT ERROR] No launch sequence found for "${name}".`;
    }
  }
  