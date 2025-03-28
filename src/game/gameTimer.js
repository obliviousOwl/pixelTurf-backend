const { db } = require("../firebase/firebase");
const { collection, addDoc, Timestamp } = require("firebase-admin/firestore");

class GameTimer {
    constructor(io, room, playerNames, duration = 60) {
        this.io = io;
        this.room = room;
        this.playerNames = playerNames; // ✅ Store player names
        this.duration = duration;
        this.remainingTime = duration;
        this.interval = null;
    }

    start() {
        // console.log(`⏳ Starting game timer for room ${this.room}: ${this.duration} seconds`);

        // console.log(this.playerNames);


        this.interval = setInterval(() => {
            if(this.remainingTime <= 0) {
                this.stop();

                this.io.to(this.room).emit("gameOver", {
                    room: this.room,
                    playerNames: this.playerNames // ✅ Send all player names
                });
                return;

            }

            // console.log(this.playerNames);

            this.io.to(this.room).emit("timerUpdate", {time: this.remainingTime});
            this.remainingTime--;
        }, 1000);
    }

    stop() {
        if(this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}


module.exports = GameTimer;
