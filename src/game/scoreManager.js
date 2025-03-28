function updateScore(room, playerId, x, y, rooms, io) {
    if (!rooms.has(room)) {
        console.warn(`⚠️ Room ${room} does not exist!`);
        return;
    }

    const gameRoom = rooms.get(room);

    if (!gameRoom.paintedAreas) {
        gameRoom.paintedAreas = new Map();
    }


    if (!gameRoom.scores[playerId]) {
        gameRoom.scores[playerId] = 0;
    }

    const key = `${Math.floor(x)},${Math.floor(y)}`;

    if (!gameRoom.paintedAreas.has(key)) {
        gameRoom.paintedAreas.set(key, playerId);
        gameRoom.scores[playerId] += 1;
    } else {
        const previousPainter = gameRoom.paintedAreas.get(key);

        if (!gameRoom.scores[previousPainter]) {
            gameRoom.scores[previousPainter] = 0;
        }

        if (previousPainter !== playerId) {
            //  Decrease previousPainter's score
            gameRoom.scores[previousPainter] = Math.max(0, gameRoom.scores[previousPainter] - 2);

            //  Increase new painter's score
            gameRoom.scores[playerId] += 1;
            gameRoom.paintedAreas.set(key, playerId);
        }
    }

    io.to(room).emit("scoreUpdate", { scores: gameRoom.scores });
}

module.exports = { updateScore };
