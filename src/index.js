const express = require("express");
const http = require("http");
const { initializeSocket } = require("./sockets/socketManager");
const { SERVER_PORT, CORS_OPTIONS } = require("./config/serverConfig");
const cors = require("cors");
const leaderboardRoutes = require("./routes/leaderboard");
const matchRecordsRoutes = require("./routes/matchRecords")

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

initializeSocket(server, CORS_OPTIONS);

app.use("/leaderboard", leaderboardRoutes);
app.use("/matchRecords", matchRecordsRoutes);

server.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
})
