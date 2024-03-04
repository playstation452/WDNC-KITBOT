const express = require('express');
const app = express();
const port = 3000; // Choose a port that's not in use
const { bot } = require('./WDNC-KITBOT/kitbot.js'); // Adjust the path as necessary

app.use(express.json()); // For parsing application/json

// Define the route to serve the sendMessage.html page first
app.get('/sendMessage', (req, res) => {
    res.sendFile(__dirname + '/WDNC-KITBOT/sendMessage.html');
});

// Then define the route to handle POST requests to /say
app.post('/say', (req, res) => {
    const message = req.body.message;
    if (message) {
        // Assuming 'bot' is your Mineflayer bot instance
        bot.chat(message);
        res.send('Message sent!');
    } else {
        res.status(400).send('No message provided');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
