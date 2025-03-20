require("dotenv").config(); // Load .env variables

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Load environment variables
const port = process.env.PORT || 5000;
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

// Allow CORS for frontend URLs from .env
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"]
}));

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

const rooms = {};

io.on("connection", (socket) => {
    console.log("A player connected:", socket.id);

    let assignedRoom = null;
    for (let room in rooms) {
        if (rooms[room].players.length < 4) {
            assignedRoom = room;
            break;
        }
    }

    if (!assignedRoom) {
        assignedRoom = `room-${Object.keys(rooms).length + 1}`;
        rooms[assignedRoom] = { players: [] };
    }

    socket.join(assignedRoom);
    rooms[assignedRoom].players.push(socket.id);

    console.log(`Player ${socket.id} joined ${assignedRoom}`);
    io.to(assignedRoom).emit("roomUpdate", rooms[assignedRoom].players);

    if (rooms[assignedRoom].players.length >= 2) {
        io.to(assignedRoom).emit("gameStart", `Game starts in ${assignedRoom}`);
    }

    socket.on("message", (data) => {
        console.log(`Received message: ${JSON.stringify(data)}`);
        socket.emit("response", `Server received: ${JSON.stringify(data)}`);
    });

    socket.on("playerMove", (data) => {
        io.emit("updatePosition", data);
    });

    socket.on("disconnect", () => {
        console.log(`Player ${socket.id} disconnected`);
        rooms[assignedRoom].players = rooms[assignedRoom].players.filter(id => id !== socket.id);

        if (rooms[assignedRoom].players.length === 0) {
            delete rooms[assignedRoom];
        } else {
            io.to(assignedRoom).emit("roomUpdate", rooms[assignedRoom].players);
        }
    });
});

server.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
