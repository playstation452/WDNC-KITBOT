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
            const position = botInstance.entity.position;
            botPositionsBeforeKill.push({ x: position.x, y: position.y, z: position.z });
            console.log(`Bot position before kill: X=${position.x}, Y=${position.y}, Z=${position.z}`);
            botInstance.chat(`/kill `);
            return;
        }
        if (message.includes('!kit')) {
            if (username === 'god66') {
                botInstance.chat(`/w god66 you are blocked from the bot`);
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

            botInstance.chat(`/tpa ` + username);
            return;
        }
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
bot.on('end', attemptReconnect);
performInitialSetup(bot);

const db = new sqlite3.Database('db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (username TEXT, value INTEGER)");
});

app.get('/', (req, res) => {
    const positions = botPositionsBeforeKill.map(pos => `X=${pos.x}, Y=${pos.y}, Z=${pos.z}`).join('\n');
    res.send(`Bot positions before kill:\n${positions}`);
});

app.listen(port, () => {
    console.log(`Web server listening at http://localhost:${port}`);
});
