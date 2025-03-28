const { Server } = require("socket.io");
const { addPlayerToQueue, removePlayerFromQueue } = require("../game/matchmaking");
const { getRoomPlayers, getPlayerRoom, removePlayerFromRoom } = require("../game/roomManager");
const { handlePlayerDataRequest } = require("../game/playerManager");
const { handlePlayerMovement } = require("../game/movementManager");
const { updateScore } = require("../game/scoreManager");
const { updateLeaderboard } = require("../game/matchResult");


// const { handlePlayerMovement } = require("../game/movementManager");
const rooms = new Map();

function initializeSocket(server, CORS_OPTIONS) {
    const io = new Server(server, { cors: CORS_OPTIONS });

    io.on("connection", (socket) => {
        console.log(`Player connected: ${socket.id}`);

        let hasRequestedData = false;

        socket.on("findMatch", ({ playerName }) => {
            console.log(`PLAYERNAME IN SOCKET MANAGER FINDMATCH EVENT ${playerName}`);
            addPlayerToQueue(socket, io, playerName);
            if (!hasRequestedData) {
                handlePlayerDataRequest(socket, io);
                hasRequestedData = true;
            }
        });

        socket.on("playerMove", (data) => {
            handlePlayerMovement(io, socket, data);
        });


        socket.on("playerPaint", ({ room, playerId, x, y }) => {
            if (!playerId) {
                console.warn(`⚠️ Missing playerId in paint event!`);
                return;
            }

            // ✅ Ensure the room exists in `rooms`
            if (!rooms.has(room)) {
                rooms.set(room, { scores: {}, paintedAreas: new Map() });
                console.log(`✅ Created new room: ${room}`);
            }

            // ✅ Update the score using the rooms Map
            updateScore(room, playerId, x, y, rooms, io);

            // ✅ Emit the updated painting event
            socket.to(room).emit("paintUpdated", { playerId, x, y });

            // ✅ Emit updated scores to all players in the room
            io.to(room).emit("scoreUpdate", { scores: rooms.get(room)?.scores || {} });
        });


        socket.on("matchResults", ({ scores, playerId, playerNames}) => {
            updateLeaderboard(scores, playerId, playerNames);
        })

        socket.on("disconnect", () => {
            console.log(`player disconnected: ${socket.id}`);

            if(removePlayerFromQueue(socket.id)) {
                console.log(`Player ${socket.id} removed from queue`);
                return;
            }

            const room = getPlayerRoom(socket.id);
            if(room) {
                removePlayerFromRoom(room, socket.id);
                console.log(`Player ${socket.id} removed from room ${room}`);

            }

        });
    });

    return io;
}

module.exports = { initializeSocket };
