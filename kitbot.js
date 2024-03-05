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
