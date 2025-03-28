const express = require("express");
const { db, admin } = require("../firebase/firebase"); // Import Firestore
const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const leaderboardRef = db.collection("leaderboard");

        // Query Firestore for the top 10 scores, ordered by score (descending)
        const snapshot = await leaderboardRef.orderBy("score", "desc").limit(10).get();

        if (snapshot.empty) {
            return res.status(200).json({ message: "No leaderboard data found.", leaderboard: [] });
        }

        // Format the leaderboard data
        const leaderboard = snapshot.docs.map((doc) => ({
            id: doc.id,
            playerId: doc.data().playerId,
            name: doc.data().name,
            score: doc.data().score,
            timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : null, // Convert timestamp
        }));

        res.status(200).json({ leaderboard });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/add", async (req, res) => {
    try {
        const { players } = req.body; // Expecting an array of players [{ id, name, score }]

        if (!players || !Array.isArray(players) || players.length !== 2) {
            return res.status(400).json({ error: "Invalid player data" });
        }

        // Add both players to Firestore
        const batch = db.batch();
        const leaderboardRef = db.collection("leaderboard");

        players.forEach((player) => {
            const docRef = leaderboardRef.doc(); // Auto-generate ID
            batch.set(docRef, {
                playerId: player.id,
                playerName: player.name,
                score: player.score,
                timestamp: admin.firestore.FieldValue.serverTimestamp(), // Store server time
            });
        });

        await batch.commit();
        res.status(200).json({ message: "Match results added successfully!" });
    } catch (error) {
        console.error("Error adding match results:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
