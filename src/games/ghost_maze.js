// src/games/ghost_maze.js

let gameState = null;

const map = {
  corridor: {
    description:
      `You wake in a flickering corridor. Every exit is darkness.\n` +
      `The air smells like burnt silicon and old batteries.\n` +
      `An unseen fan hums somewhere, steady as a ticking heart...`,
    items: [],
    exits: { north: 'hallway' },
  },

  hallway: {
    description:
      `You walk into a dusty hallway. Faint whispers echo.\n` +
      `You see: map.`,
    items: ['map'],
    exits: { south: 'corridor', east: 'library' },
  },

  library: {
    description:
      `You enter a moldy library. Books line the walls. Something watches.\n` +
      `You see: key.`,
    items: ['key'],
    exits: { west: 'hallway', north: 'ghost_room' },
  },

  ghost_room: {
    description: `A ghost floats here, shimmering. It blocks the exit.`,
    items: [],
    exits: {},
  },

  exit: {
    description: `You see a creaky door labeled 'EXIT'.`,
    items: [],
    exits: {},
  }
};

// Ghost pun list and correct answers
const ghostPuns = [
  { pun: 'haunt sauce', response: `"haunt sauce"... The ghost giggles uncontrollably. 'You may pass, mortal!'` },
  { pun: 'witch way out', response: `"witch way out"? The ghost cackles gleefully. 'You’ve got the spirit!'` },
  { pun: 'creep it real', response: `"creep it real"? The ghost nods approvingly. 'You’re a scream!'` },
];

export function launchGhostMaze() {
  gameState = {
    location: 'corridor',
    inventory: [],
    ghostPunUsed: false,
    gameOver: false,
    hasKey: false,
  };

  return `
  ██████╗ ██╗  ██╗ ██████╗ ███████╗████████╗    ███╗   ███╗ █████╗ ███████╗███████╗
 ██╔═══██╗██║  ██║██╔════╝ ██╔════╝╚══██╔══╝    ████╗ ████║██╔══██╗██╔════╝██╔════╝
 ██║   ██║███████║██║  ███╗█████╗     ██║       ██╔████╔██║███████║███████╗█████╗  
 ██║   ██║██╔══██║██║   ██║██╔══╝     ██║       ██║╚██╔╝██║██╔══██║╚════██║██╔══╝  
 ╚██████╔╝██║  ██║╚██████╔╝███████╗   ██║       ██║ ╚═╝ ██║██║  ██║███████║███████╗
  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝       ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝

>> GHOST MAZE: ESCAPE... OR STAY FOREVER. <<

${map.corridor.description}

Type 'look' to inspect your surroundings.
Type 'go [direction]' to move.
Type 'take [item]' to collect things.
Type 'inventory' to check your items.
Type 'pun [your pun]' to make the ghost laugh.
Type 'exit' to quit.
  `.trim();
}

function itemInRoom(item) {
  const room = map[gameState.location];
  return room.items.includes(item);
}

function removeItemFromRoom(item) {
  const room = map[gameState.location];
  room.items = room.items.filter(i => i !== item);
}

export function ghostMazeInput(inputRaw) {
  if (!gameState || gameState.gameOver) {
    return 'The game is over. Type "exit" to return to shell.';
  }

  const input = inputRaw.trim().toLowerCase();
  const words = input.split(' ');
  const command = words[0];
  const args = words.slice(1);

  // Handle pun commands or direct pun inputs
  // If input is "pun [something]" OR input is just a pun phrase or pun number

  const isPunCommand = command === 'pun';
  const punText = isPunCommand ? args.join(' ') : input;

  // Check if input is a pun number
  const punNumber = parseInt(punText);
  const punIndex = !isNaN(punNumber) ? punNumber - 1 : -1;

  if ((isPunCommand || ghostPuns.some(p => p.pun === input) || punIndex >= 0) && gameState.location === 'ghost_room') {
    if (!punText) {
      return `Choose a pun by number or phrase! For example: pun 1 or pun haunt sauce\nAvailable puns:\n${ghostPuns.map((p, i) => `${i+1}) ${p.pun}`).join('\n')}`;
    }

    let matchedPun = null;
    if (punIndex >= 0 && punIndex < ghostPuns.length) {
      matchedPun = ghostPuns[punIndex];
    } else {
      matchedPun = ghostPuns.find(p => p.pun === punText);
    }

    if (matchedPun) {
      gameState.ghostPunUsed = true;
      return matchedPun.response;
    } else {
      return `"${punText}" doesn't amuse the ghost. Try another pun.`;
    }
  }

  // Process commands normally

  switch (command) {
    case 'look':
      return map[gameState.location].description;

    case 'go':
      if (args.length === 0) {
        return 'Go where? Try: go north';
      }
      const dir = args[0];
      const room = map[gameState.location];
      if (room.exits[dir]) {
        // Check ghost blocking exit north from ghost_room
        if (gameState.location === 'ghost_room' && !gameState.ghostPunUsed) {
          return 'The ghost blocks your way. It demands a good pun before letting you pass.';
        }

        gameState.location = room.exits[dir];
        // Special handling if exiting ghost_room and have key
        if (gameState.location === 'exit') {
          if (gameState.hasKey) {
            gameState.gameOver = true;
            return `🎉 You escaped the haunted maze. But the ghost still remembers your joke. 🪦`;
          } else {
            gameState.location = 'ghost_room';
            return 'The exit is locked. You need a key.';
          }
        }

        return map[gameState.location].description;
      } else {
        return `You can't go ${dir} from here.`;
      }

    case 'take':
      if (args.length === 0) {
        return 'Take what? Try: take key';
      }
      const item = args[0];
      if (itemInRoom(item)) {
        gameState.inventory.push(item);
        removeItemFromRoom(item);
        if (item === 'key') {
          gameState.hasKey = true;
        }
        return `You take the ${item}.`;
      } else {
        return `There’s no ${item} here.`;
      }

    case 'inventory':
      if (gameState.inventory.length === 0) {
        return 'You are carrying: nothing';
      }
      return `You are carrying: ${gameState.inventory.join(', ')}`;

    case 'exit':
      gameState.gameOver = true;
      return 'Exiting ghost maze. Type "exit" again to return to shell.';

    default:
      return 'Unknown command. Try: look, go [direction], take [item], inventory, pun [your pun]';
  }
}
