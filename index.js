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
        const darkedColor = await darkenImageColorToHex(color)
        console.log(`Now playing on Spotify: ${newSpotifyActivity.details} by ${newSpotifyActivity.state}`);
        const mCard = await new MusicCard()
            .setSong(newSpotifyActivity.details)
            .setArtist(newSpotifyActivity.state)
            .setAlbum(newSpotifyActivity.assets.largeText)
            .setCover(`https://i.scdn.co/image/${newSpotifyActivity.assets.largeImage.slice(8)}`)
            .setTime(currentTime, songDuration)
            .setColor("gradient", color, "#1c1c1c", 0.75)
            .setBar(darkedColor)
            .build()

        fs.writeFileSync('./image-output.png', mCard);
    }
});

// You login with your discord bot token
client.login(process.env.DISCORD_TOKEN);

// This will be for later purposes
module.exports = { client };

function darkenRGBColor(color, factor = 0.8) {
    const { r, g, b } = color;
    
    // Multiply each color channel by the darkening factor
    const newR = Math.max(0, Math.min(255, r * factor));
    const newG = Math.max(0, Math.min(255, g * factor));
    const newB = Math.max(0, Math.min(255, b * factor));

    return { r: Math.round(newR), g: Math.round(newG), b: Math.round(newB) };
}

// Convert RGB to Hex
function rgbToHex(r, g, b) {
    const toHex = (component) => component.toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Parse the rgb() string to extract r, g, and b values
function parseRGB(rgbString) {
    const rgbValues = rgbString.match(/\d+/g); // Extract numbers from the rgb() string
    return {
        r: parseInt(rgbValues[0]),
        g: parseInt(rgbValues[1]),
        b: parseInt(rgbValues[2])
    };
}

async function darkenImageColorToHex(rgbString) {

    const originalColor = parseRGB(rgbString);  // Parse the rgb string to get an RGB object
    console.log("Parsed RGB Color:", originalColor);

    const darkenedColor = darkenRGBColor(originalColor, 0.8); // Darken the RGB color
    console.log("Darkened Color (RGB):", darkenedColor);  // Output darkened RGB color

    // Convert the darkened RGB color to Hex
    const darkenedHexColor = rgbToHex(darkenedColor.r, darkenedColor.g, darkenedColor.b);
    console.log("Darkened Color (Hex):", darkenedHexColor);  // Output darkened Hex color

    return `${darkenedHexColor}`;
}
function isPlayingSpotify(presence) {
    if (!presence || !presence.activities) return null;
    return presence.activities.find(activity => activity.type === 2 && activity.name === 'Spotify');
}