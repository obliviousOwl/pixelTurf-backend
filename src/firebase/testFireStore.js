const { db, admin } = require("./firebase"); // ✅ Ensure admin is imported

const testFirestore = async () => {
    try {
        const docRef = await db.collection("testCollection").add({
            message: "Hello from the backend!",
            timestamp: admin.firestore.FieldValue.serverTimestamp(), // ✅ Ensure this is correctly used
        });

        console.log("Document written with ID:", docRef.id);
    } catch (error) {
        console.error("Error writing document:", error);
    }
};

testFirestore();
