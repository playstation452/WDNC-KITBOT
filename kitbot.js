const sqlite3 = require('sqlite3').verbose();
const mineflayer = require('mineflayer');
const mcData = require('minecraft-data');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const app = express();
const port = 8080; // Adjusted to 8080

const baseX = process.env.BASE_X;
const baseZ = process.env.BASE_Z;

const botName = "WDNC_KITBOT";
const blacklist = ['god66'];

// Variable to track the last time the !kit command was used
let lastKitCommandTime = 0;
// Variable to track the last time a cooldown message was sent for each user
let lastCooldownMessageTime = {};
// Variable to store the bot's positions before kill
let botPositionsBeforeKill = [];

// Function to create a new bot instance
function createBot() {
    return mineflayer.createBot({
        host: 'netherportal.org',
        username: botName,
        auth: 'offline',
        port: 25565,
        version: `1.12.2`,
        viewDistance: 'tiny'
    });
}

// Function to perform initial setup actions
function performInitialSetup(botInstance) {
    // Your existing setup code...
}

// Function to attempt reconnection
function attemptReconnect() {
    // Your existing reconnection code...
}

// Initial bot creation
const bot = createBot();
bot.on('end', attemptReconnect);
performInitialSetup(bot);

const db = new sqlite3.Database('db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (username TEXT, value INTEGER)");
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Route to serve minecraft-coords.html
app.get('/updated', (req, res) => {
    res.sendFile(path.join(__dirname, 'updated.html'));
});

// Route to serve send-message.html
app.get('/send-message', (req, res) => {
    res.sendFile(path.join(__dirname, 'send-message.html'));
});

// Your existing routes and setup...

app.listen(port, () => {
    console.log(`Web server listening at http://localhost:${port}`);
});

// Export the bot instance after it has been fully initialized
module.exports = bot;
