const { updatePlayerPosition } = require("./roomManager");

function handlePlayerMovement(io, socket, data) {
    const { room, playerId, x, y } = data;

    if (!room || !playerId) {
        console.error(`❌ handlePlayerMovement: Received invalid room (${room}) from player "${playerId}".`);
        return;
    }

    if (updatePlayerPosition(room, playerId, x, y)) {
        // ✅ Only emit the player's new position instead of the whole room
        io.to(room).emit("playerMoved", { playerId, x, y });
    }
}

module.exports = { handlePlayerMovement };
