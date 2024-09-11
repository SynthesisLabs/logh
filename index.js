// Importing the dependencies
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Making the client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences] });

// The bot will send once a message in the console that it is ready to use
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// We will see if someone updated their presence
client.on("presenceUpdate", (oldUser, newUser) => {

    // Making a variable named status
    let status;

    // Checking how many activities the user has, if 1 pick activity 1 if not pick activity 2
    if (newUser.activities.length === 1) status = newUser.activities[0];
    if (newUser.activities.length > 1) status = newUser.activities[1];

    // Checking if the user is doing Spotify, if so log the state
    if (status !== null && status.name === "Spotify" && status.assets !== null) console.log(status.state)
})

// You login with your discord bot token
client.login(process.env.DISCORD_TOKEN);


// This will be for later purposes
module.exports = client;
