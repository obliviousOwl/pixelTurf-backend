const rooms = {};

const assignedColors = {}; // Tracks used colors per room

const generateRandomColor = (room) => {
    const colors = [0xff0000, 0x0000ff, 0x00ff00];

    // Ensure room exists in tracking object
    if (!assignedColors[room]) {
        assignedColors[room] = new Set();
    }

    // Filter out already assigned colors
    const availableColors = colors.filter(color => !assignedColors[room].has(color));

    // If all colors are used, reset tracking (fallback)
    if (availableColors.length === 0) {
        assignedColors[room].clear();
        return generateRandomColor(room);
    }

    // Pick a random available color
    const chosenColor = availableColors[Math.floor(Math.random() * availableColors.length)];

    // Store assigned color
    assignedColors[room].add(chosenColor);

    return `#${chosenColor.toString(16).padStart(6, "0")}`;
};

const generateRandomPosition = (isLeftSide) => {
    return {
        x: isLeftSide
            ? Math.floor(Math.random() * 225) + 50  // Left side (50 - 275)
            : Math.floor(Math.random() * 225) + 275, // Right side (275 - 500)
        y: Math.floor(Math.random() * 300) + 50  // Same y range for both
    };
};

const updatePlayerPosition = (room, playerId, x, y) => {
    if (!rooms[room]) return false;

    const player = rooms[room].find(player => player.id === playerId);
    if (!player) return false;

    player.position = player.position || { x: 0, y: 0 };
    player.position.x = x;
    player.position.y = y;
    return true;
};

const addPlayerToRoom = (room, playerId, playerName) => {
    if (!rooms[room]) {
        rooms[room] = [];
    }
    console.log(`PLAYERNAME IN ROOMMANAGER: ${playerName}`);


    const existingPlayer = rooms[room].find(player => player.id === playerId);
    if (existingPlayer) {
        return existingPlayer; // Don't create new data if already exists
    }

    // Randomly assign left or right side for positioning
    const isLeftSide = rooms[room].length === 0; // First player is left, second is right

    const playerData = {
        id: playerId,
        name: playerName,
        color: generateRandomColor(room),
        position: generateRandomPosition(isLeftSide)
    };

    rooms[room].push(playerData);

    return playerData;
};

const getRoomPlayers = (room) => {
    return rooms[room] || [];
};

const getRoomPlayerData = (room) => {
    return rooms[room] || null; // Returns stored player data
};

const getPlayerRoom = (playerId) => {
    for (const room in rooms) {
        if (rooms[room].some(player => player.id === playerId)) {
            return room;
        }
    }
    return null;
};

const removePlayerFromRoom = (room, playerId) => {
    if (!rooms[room]) return;
    rooms[room] = rooms[room].filter(player => player.id !== playerId);

    if (rooms[room].length === 0) {
        delete rooms[room];
    }
};

module.exports = {
    addPlayerToRoom,
    getRoomPlayers,
    getRoomPlayerData,
    removePlayerFromRoom,
    updatePlayerPosition,
    getPlayerRoom
};
