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
})

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

bot.on('end', () => {
    console.log('Bot disconnected. Attempting to reconnect...');
    setTimeout(mineflayer.createBot, 5000); // Attempt to reconnect after 5 seconds
});


/*--------------  StopWatch  --------------*/

class Stopwatch {
    constructor() {
        this.startTime = 0;
    }

    start() {
        this.startTime = new Date().getTime();
    }

    stop() {
        this.startTime = 0;
    }

    set(seconds) {
        this.startTime = seconds;
    }

    getElapsedTime() {
        if (this.startTime === 0) {
            return 0;
        } else {
            return (new Date().getTime() - this.startTime) / 1000;
        }
    }
}


/*--------------  Events  --------------*/

let data = mcData.IndexedData;
let requestsQueue = [];
let cooldownMap = new Map();
let tickCounter = 0;
let tpName;
let devMode = false;
let isDelivering = false;

const tpaTimer = new Stopwatch();
const cooldownTimer = new Stopwatch();


bot.once('spawn', () => {
    cooldownTimer.set(25);

    setInterval(() => {
        bot.chat('do !kit for a free kit');
    }, 60000); // 60000 milliseconds = 1 minute

    // Send the /login command as soon as the bot spawns
    bot.chat(`/login 11111111 `);

    // Schedule the /server main command to be executed after a 5 second delay
    setTimeout(() => {
            bot.chat(`/server main`);
    }, 5000); // Delay of 5 seconds

    bot.on('kicked', e => {
        chatHook("Kicked", e);
        db.close();
        bot.waitForTicks(200);
        process.exit();
    })

    bot.on('error', e => {
        chatHook("Error", e);
        db.close();
        bot.waitForTicks(200);
        process.exit();
    })

    data = mcData(bot.version);
    shulkers = data.itemsArray
        .filter((item) => /^.*_shulker_box/.test(item.name))
        .map((item) => item.name);

        bot.on('chat', (username, message) => {
            if (username === bot.username)
                return;
            if (username === 'playstation451' && message === `login`) {
                bot.chat(`/login ` + process.env.BOT_PW);
                return;
            }
        
        bot.on('chat', (username, message) => {
            if (username === bot.username)
                return;
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
})
})
})
