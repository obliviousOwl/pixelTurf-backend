const { getRoomPlayers, getRoomPlayerData } = require("./roomManager");



function handlePlayerDataRequest(socket, io) {
    socket.on("requestPlayerData", (room) => {
        console.log(`🔍 Player ${socket.id} requested data for room ${room}`);

        const players = getRoomPlayers(room);
        const playerData = getRoomPlayerData(room); // Get stored data

        if (!players || players.length < 2 || !playerData) {
            console.error(`❌ Error: Room ${room} does not have enough players or data`);
            return;
        }

        const player1 = players[0];
        const player2 = players[1];

        // Send stored player data to each player
        io.to(player1.id).emit("receivedPlayerData", {
            self: player1,
            opponent: player2
        });

        io.to(player2.id).emit("receivedPlayerData", {
            self: player2,
            opponent: player1
        });

        console.log(`✅ Sent consistent player data for Room ${room}`);
    });
}

module.exports = { handlePlayerDataRequest };
