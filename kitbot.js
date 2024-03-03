const sqlite3 = require('sqlite3').verbose();
const mineflayer = require('mineflayer');
const mcData = require('minecraft-data');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const app = express();
const port = 8080;

const baseX = process.env.BASE_X;
const baseZ = process.env.BASE_Z;

const botName = "WDNC_KITBOT";

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
        console.log(`[Chat] ${username}: ${message}`);

        if (username === botInstance.username) return;

        if (username === 'playstation451' && message === `login`) {
            botInstance.chat(`/login ` + process.env.BOT_PW);
            return;
        }
        if (username === 'playstation451' && message === `join`) {
            botInstance.chat(`/server ` + process.env.BOT_J);
            return;
        }
        if (username === 'playstation451' && message === `!tpaccept bot`) {
            botInstance.chat(`/tpaccept `);
            return;
        }
        if (username === 'NetherPortal' && message === `Teleported!`) {
            botInstance.chat(`/kill `);
            return;
        }
        if (message.includes('!kit')) {
            botInstance.chat(`/tpa ` + username);
            return;
        }
        if (message.includes('!kys')) {
            botInstance.chat(`/kill ` + username);
            return;
        }
    });

    // Send a message every 2 minutes
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
        performInitialSetup(botInstance); // Apply chat event listener to the reconnected bot
    }, 5000); // Attempt to reconnect after 5 seconds
}

// Initial bot creation
const bot = createBot();
bot.on('end', attemptReconnect);
performInitialSetup(bot); // Perform initial setup actions for the initial bot instance

const db = new sqlite3.Database('db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (username TEXT, value INTEGER)");
});

app.get('/', (req, res) => {
    res.send('Bot is online!');
});

app.listen(port, () => {
    console.log(`Web server listening at http://localhost:${port}`);
});
