// Importing the dependencies
require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { MusicCard } = require("./utils/image.js")
const { ImageColorExtractor } = require('./utils/color.js')
const fs = require('node:fs');

// Making the client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers],
    partials: [Partials.User, Partials.GuildMember, Partials.Presence],
});

// The bot will send once a message in the console that it is ready to use
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('presenceUpdate', async (oldPresence, newPresence) => {
    if (!newPresence || newPresence.user.id !== process.env.USER_ID || !newPresence.activities) return;

    // Get the Spotify activities from both old and new presences
    const oldSpotifyActivity = isPlayingSpotify(oldPresence);
    const newSpotifyActivity = isPlayingSpotify(newPresence);

    // Log when there's a new song playing (details property changes)
    if (newSpotifyActivity && (!oldSpotifyActivity || oldSpotifyActivity.details !== newSpotifyActivity.details)) {

        // Get song start and end timestamps (in milliseconds)
        const songStartTime = newSpotifyActivity.timestamps.start;
        const songEndTime = newSpotifyActivity.timestamps.end;

        // Calculate the total song duration (in seconds)
        const songDuration = (songEndTime - songStartTime) / 1000;

        // Calculate the current time in the song (in seconds)
        let currentTime = (Date.now() - songStartTime) / 1000;
        if(currentTime < 0) currentTime = 0.00
        console.log(currentTime)
        // console.log(newSpotifyActivity)
        const color = await new ImageColorExtractor().getColorFromImage(`https://i.scdn.co/image/${newSpotifyActivity.assets.largeImage.slice(8)}`)
        console.log(`Now playing on Spotify: ${newSpotifyActivity.details} by ${newSpotifyActivity.state}`);
        const mCard = await new MusicCard()
            .setSong(newSpotifyActivity.details)
            .setArtist(newSpotifyActivity.state)
            .setAlbum(newSpotifyActivity.assets.largeText)
            .setCover(`https://i.scdn.co/image/${newSpotifyActivity.assets.largeImage.slice(8)}`)
            .setTime(currentTime, songDuration)
            .setColor("solid", "#1c1c1c")
            .build()

        fs.writeFileSync('./image-output.png', mCard);
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