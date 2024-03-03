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

const bot = mineflayer.createBot({
    host: 'netherportal.org',
    username: botName,
    auth: 'offline',
    port: 25565,
    version: `1.12.2`,
    viewDistance: 'tiny'
});

const db = new sqlite3.Database('db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (username TEXT, value INTEGER)");
});

// Your Stopwatch class and other initializations remain unchanged...

bot.once('spawn', () => {
    // Send the /login command as soon as the bot spawns
    bot.chat(`/login 11111111 `);

    // Schedule the /server main command to be executed after a 5 second delay
    setTimeout(() => {
        bot.chat(`/server main`);
    }, 5000); // Delay of 5 seconds
});

bot.on('chat', (username, message) => {
    if (username === bot.username) return; // Ignore messages from the bot itself

    // Check if the message contains the login prompt
    if (message.includes("Please, login with the command: /login <password>")) {
        // Respond with the /login command followed by the password
        bot.chat(`/login 11111111`);
    }

    // Your existing chat handling logic here...
    if (username === 'playstation451' && message === `login`) {
        bot.chat(`/login ` + process.env.BOT_PW);
        return;
    }
    if (username === 'playstation451' && message === `join`) {
        bot.chat(`/server ` + process.env.BOT_J);
        return;
    }
    if (username === 'playstation451' && message === `!tpaccept bot`) {
        bot.chat(`/tpaccept `);
        return;
    }
    if (message.includes('!kit')) {
        bot.chat(`/tpa ` + username); // Send a /tpa command to the sender
        return;
    }
    if (message.includes('!kys')) {
        bot.chat(`/kill ` + username); // WDNC KITBOT DONT COMITE SUICIDE
        return;
    }
});

// Your error and end event handlers remain unchanged...

bot.on('end', () => {
    console.log('Bot disconnected. Attempting to reconnect...');
    setTimeout(() => {
        // Recreate the bot with the same configuration
        mineflayer.createBot({
            host: 'netherportal.org',
            username: botName,
            auth: 'offline',
            port: 25565,
            version: `1.12.2`,
            viewDistance: 'tiny'
        });
    }, 5000); // Attempt to reconnect after 5 seconds
});

app.get('/', (req, res) => {
    res.send('Bot is online!');
});

app.listen(port, () => {
    console.log(`Web server listening at http://localhost:${port}`);
});
