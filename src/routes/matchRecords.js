const express = require("express");
const router = express.Router();
const { db, admin } = require("../firebase/firebase"); // Firestore instance
const { collection, addDoc, Timestamp } = require("firebase-admin/firestore");

// POST /matchRecords - Save a match result to Firestore
router.post("/", async (req, res) => {
    try {
        const { winner, loser } = req.body;

        if (!winner || !loser) {
            return res.status(400).json({ error: "Winner and loser data are required." });
        }

        // Create a new match record in Firestore
        const docRef = await addDoc(collection(db, "matchRecords"), {
            winner,
            loser,
            timestamp: Timestamp.now(),
        });

        res.status(201).json({ message: "Match record added successfully!", matchId: docRef.id });
    } catch (error) {
        console.error("Error adding match record:", error);
        res.status(500).json({ error: "Failed to add match record." });
    }
});


router.get("/", async (req, res) => {
    try {
        const matchRecordsRef = collection(db, "matchRecords");
        const snapshot = await matchRecordsRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "No match records found." });
        }

        let matchRecords = [];
        snapshot.forEach((doc) => {
            matchRecords.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(matchRecords);
    } catch (error) {
        console.error("Error fetching match records:", error);
        res.status(500).json({ error: "Failed to fetch match records." });
    }
});

module.exports = router;
