// Importing the dependencies
require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const createImage = require("./image.js")

// Making the client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers],
    partials: [Partials.User, Partials.GuildMember, Partials.Presence],
});

// The bot will send once a message in the console that it is ready to use
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const lastSongMap = new Map();

client.on('presenceUpdate', (oldPresence, newPresence) => {
    if (!newPresence || newPresence.user.id !== process.env.USER_ID || !newPresence.activities) return;

    const oldSpotifyActivity = isPlayingSpotify(oldPresence);
    const newSpotifyActivity = isPlayingSpotify(newPresence);

    if (newSpotifyActivity) {
        const userId = newPresence.user.id;
        const currentSong = newSpotifyActivity.details;
        const lastSong = lastSongMap.get(userId);

        if (!lastSong || lastSong !== currentSong) {
            lastSongMap.set(userId, currentSong);

            const songStartTime = newSpotifyActivity.timestamps.start;
            const songEndTime = newSpotifyActivity.timestamps.end;
            const songDuration = (songEndTime - songStartTime) / 1000;
            const currentTime = (Date.now() - songStartTime) / 1000;

            fs.writeFileSync(`./image-output-${user}.png`, asdahd);
            console.log(`Image saved as image-output-${user}.png`);
        }
    }
});

// You login with your discord bot token
client.login(process.env.DISCORD_TOKEN);

// This will be for later purposes
module.exports = { client };



function isPlayingSpotify(presence) {
    if (!presence || !presence.activities) return null;
    return presence.activities.find(activity => activity.type === 2 && activity.name === 'Spotify');
}