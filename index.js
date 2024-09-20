// Importing the dependencies
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Making the client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences] });

// The bot will send once a message in the console that it is ready to use
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


function isPlayingSpotify(presence) {
    if (!presence || !presence.activities) return null;
    return presence.activities.find(activity => activity.type === 2 && activity.name === 'Spotify');
}

// We will see if someone updated their presence
client.on("presenceUpdate", (oldPresence, newPresence) => {
    // Making a variable named status
    if (!newPresence || !newPresence.user || !newPresence.activities) return;

    // Get the Spotify activities from both old and new presences
    const oldSpotifyActivity = isPlayingSpotify(oldPresence);
    const newSpotifyActivity = isPlayingSpotify(newPresence);

    // Log when there's a new song playing (details property changes)
    if (newSpotifyActivity && (!oldSpotifyActivity || oldSpotifyActivity.details !== newSpotifyActivity.details)) {
        console.log(`Now playing on Spotify: ${newSpotifyActivity.details} by ${newSpotifyActivity.state}`);
    }
})

// You login with your discord bot token
client.login(process.env.DISCORD_TOKEN);


// This will be for later purposes
module.exports = client;