// src/game/gameManager.js
const { updateScore } = require("./scoreManager");

class GameManager {
    constructor() {
        this.rooms = new Map(); // Stores rooms with players
    }

    addPlayer(room, playerId) {
        if (!this.rooms.has(room)) {
            this.rooms.set(room, { players: {}, scores: {} });
        }
        this.rooms.get(room).players[playerId] = { x: 0, y: 0 }; // Initial position
        this.rooms.get(room).scores[playerId] = 0; // Initial score
    }

    updatePlayerPosition(room, playerId, x, y) {
        if (this.rooms.has(room)) {
            this.rooms.get(room).players[playerId] = { x, y };
            updateScore(room, playerId, x, y, this.rooms); // Update score
        }
    }

    getGameState(room) {
        return this.rooms.get(room);
    }
}

module.exports = new GameManager();
