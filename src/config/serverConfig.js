module.exports = {
    SERVER_PORT: process.env.PORT || 5000,
    CORS_OPTIONS: {
        origin: "*",
        methods: ["GET", "POST"]
    }
};
