const sqlite3 = require('sqlite3').verbose();
const mineflayer = require('mineflayer');
const mcData = require('minecraft-data');
const axios = require('axios');
const fs = require('fs'); 
require('dotenv').config();
const express = require('express');
const app = express();
const port = 8080; // Adjusted to 8080
const path = require('path'); // Ensure the path module is required

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
    botInstance.on('login', () => {
        botInstance.chat(`/login 11111111 `);

        setTimeout(() => {
            botInstance.chat(`/server main`);
        }, 5000); // Delay of 5 seconds
    });

    botInstance.on('chat', (username, message) => {
        console.log(`[Chat] ${username}: ${message}`); // This line logs the chat messages

        if (username === botInstance.username) return;

        // Handle the !kit command
        if (message.includes('!kit')) {
            if (blacklist.includes(username)) {
                botInstance.chat(`/w ${username} you are blocked from the bot go cry nigga`);
                return;
            }
            const currentTime = Date.now();
            if (currentTime - lastKitCommandTime < 10000) {
                if (lastCooldownMessageTime[username] && currentTime - lastCooldownMessageTime[username] < 10000) {
                    return;
                }
                botInstance.chat(`/w ${username} !kit on cooldown.`);
                lastCooldownMessageTime[username] = currentTime;
                return;
            }
            lastKitCommandTime = currentTime;

            // Assuming /tpa is the command to teleport the player to the bot
            botInstance.chat(`/tpa ${username}`);
            return;
        }

        // Additional chat handling logic here...
    });

    setInterval(() => {
        botInstance.chat('> do !kit for a kit');
    }, 120000); // 2 minutes in milliseconds
}

// Function to attempt reconnection
function attemptReconnect() {
    console.log('Bot disconnected. Attempting to reconnect...');
    setTimeout(() => {
        const botInstance = createBot();
        botInstance.once('spawn', () => {
            console.log('Bot reconnected successfully.');
            botInstance.chat(`/login 11111111 `);

            setTimeout(() => {
                botInstance.chat(`/server main`);
            }, 5000); // Delay of 5 seconds
        });
        botInstance.on('end', attemptReconnect);
        performInitialSetup(botInstance);
    }, 5000); // Attempt to reconnect after 5 seconds
}

// Initial bot creation
const bot = createBot();
bot.once('spawn', () => {
    console.log('Bot connected successfully.');
    performInitialSetup(bot);
});
bot.on('end', attemptReconnect);

app.get('/', (req, res) => {
    const positions = botPositionsBeforeKill.map(pos => `X=${pos.x}, Y=${pos.y}, Z=${pos.z}`).join('\n');
    res.send(`Bot positions before kill:\n${positions}`);
});

app.listen(port, () => {
    console.log(`Web server listening at http://localhost:${port}`);
});

// Export the bot instance after it has been fully initialized
module.exports = bot;
