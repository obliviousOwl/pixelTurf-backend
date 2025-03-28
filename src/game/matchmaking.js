const { addPlayerToRoom, getRoomPlayers } = require("./roomManager");
const GameTimer = require("../game/gameTimer");

const queue = [];
const activeGames = {};

function addPlayerToQueue(socket, io, playerName) {
    queue.push({ socket, playerName }); // Store playerName with socket
    console.log(`PlayerNAMES IN MATCHMAKING: ${playerName}`);

    if (queue.length >= 2) {
        const player1 = queue.shift();
        const player2 = queue.shift();

        const room = `room-${player1.socket.id}-${player2.socket.id}`;
        player1.socket.join(room);
        player2.socket.join(room);

        const playerData1 = addPlayerToRoom(room, player1.socket.id, player1.playerName);
        const playerData2 = addPlayerToRoom(room, player2.socket.id, player2.playerName);

        console.log(`Room created: ${room}`);
        console.log(`Player 1: ${JSON.stringify(playerData1)}`);
        console.log(`Player 2: ${JSON.stringify(playerData2)}`);

        io.to(room).emit("matchFound", {
            room,
            players: getRoomPlayers(room)
        });


        if (!activeGames[room]) {
            const players = getRoomPlayers(room); // ✅ Get all players in the room
            const playerNames = {}; // ✅ Store player names

            players.forEach((player) => {
                playerNames[player.id] = player.name; // ✅ Map player ID to name
            });

            activeGames[room] = new GameTimer(io, room, playerNames, 60); // ✅ Pass all player names
            activeGames[room].start();
        }
    }
}

function removePlayerFromQueue(playerId) {
    const index = queue.findIndex(p => p.socket.id === playerId);
    if (index !== -1) {
        queue.splice(index, 1);
        return true;
    }
    return false;
}

module.exports = { addPlayerToQueue, removePlayerFromQueue };
