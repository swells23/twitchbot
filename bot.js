const tmi = require('tmi.js'),
    fetch = require("node-fetch");
require('dotenv').config();

// Define configuration options
const opts = {
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: [
        process.env.CHANNEL_NAME
    ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.on('join', onJoinHandler);
client.on('followersonly', onFollowersOnlyHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim();

    // If the command is known, let's execute it
    if (commandName === '!dice') {
        const num = rollDice();
        client.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandName} command`);
    } else {
        console.log(`* Unknown command ${commandName}`);
    }
}

// Function called when the "dice" command is issued
function rollDice() {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}

function onFollowersOnlyHandler(target, enabled, length) {
    console.log('Followers only mode: ', enabled)
}

async function onJoinHandler(target, user, self) {
    console.log(user, 'has joined the channel')

    const accountage = await fetch(`https://decapi.me/twitch/accountage/${user}`).
        then(function (res) { return res.text() }),
        minuteIdx = accountage.indexOf('minute');
        console.log('String: ', accountage)
        console.log('Accountage: ', parseInt(accountage.substring(0, 2)))
    if (minuteIdx >= 1 && minuteIdx <= 3 && parseInt(accountage.substring(0, 2)) < 5) {
        console.log('ParsedInt: ', parseInt(accountage.substring(0, 2)))
        console.log(`${user} should be perma banned`)
    }
}