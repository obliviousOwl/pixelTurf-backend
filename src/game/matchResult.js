const admin = require('firebase-admin');
const db = admin.firestore();

async function updateLeaderboard(scores, playerId, playerNames)  {
    console.log(scores);
    console.log(playerId);
    console.log(playerNames);

    for (const [id, score] of Object.entries(scores)) {
        const playerName = playerNames[id] || `Player ${id}`; // Use player name or default to "Player {id}"
        const extractedId = id;

        try {
            // Save each player’s score in the Firestore leaderboard collection
            await db.collection('leaderboard').doc(id) // Using player ID as document ID (optional)
                .set({
                    name: playerName,
                    score: score,
                    playerId: extractedId,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(), // Timestamp of when score was updated
                });

            console.log(`🏆 Player ${playerName} with ID ${id} has been added to the leaderboard with a score of ${score}`);
        } catch (error) {
            console.error("Error adding to leaderboard:", error);
        }
    }


}

module.exports = {updateLeaderboard};
