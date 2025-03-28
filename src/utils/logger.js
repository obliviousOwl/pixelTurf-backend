const logEvent = (message) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

module.exports = { logEvent };
