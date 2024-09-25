const { createCanvas, loadImage } = require('canvas');
const fs = require('node:fs');

async function createImage(song, artist, album, img, currentTime, songDuration) {
    const width = 800;
    const height = 440;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // Helper function to format time (mm:ss)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // Background
    context.fillStyle = '#282c34';
    context.fillRect(0, 0, width, height);

    // Song Text
    context.fillStyle = '#ffffff';
    context.font = 'bold 36px Arial';
    context.fillText(`Now Playing:`, 50, 100);

    // Song Name
    context.font = 'bold 48px Arial';
    context.fillText(song, 50, 180);

    // Artist Name
    context.font = 'italic 36px Arial';
    context.fillText(`By ${artist}`, 50, 260);

    // Album Name
    context.font = 'bold 28px Arial';
    context.fillText(`Album: ${album}`, 50, 320);

    // Draw Progress Bar
    const barWidth = 700; // Total width of the progress bar
    const barHeight = 20;  // Height of the progress bar
    const barX = 50;       // X position
    const barY = 350;      // Y position

    // Calculate the percentage of the song that has been played
    const progressPercent = currentTime / songDuration;

    // Background of the progress bar (gray)
    context.fillStyle = '#555';
    context.fillRect(barX, barY, barWidth, barHeight);

    // Foreground (the filled part) of the progress bar (green)
    context.fillStyle = '#3ec6f4';
    context.fillRect(barX, barY, barWidth * progressPercent, barHeight);

    // Timestamp
    context.font = 'bold 24px Arial';
    const startTimeText = formatTime(currentTime); // Current position
    const endTimeText = formatTime(songDuration);  // Song duration

    // Draw start and end times at the ends of the progress bar
    context.fillStyle = '#ffffff';
    context.fillText(startTimeText, barX, barY + 40); // Start time on the left
    context.fillText(endTimeText, barX + barWidth - context.measureText(endTimeText).width, barY + 40); // End time on the right

    // Load and draw the image from URL
    const image = await loadImage(img); // Use the image URL passed as a parameter
    const imageWidth = 240; // Desired width for the image
    const imageHeight = (image.height / image.width) * imageWidth; // Maintain aspect ratio

    // Position the image in the top right corner
    context.drawImage(image, width - imageWidth - 50, 50, imageWidth, imageHeight); // Top right corner with padding

    try {
        // Save the image to file
        const buffer = await canvas.toBuffer('image/png');
        fs.writeFileSync('./image-output.png', buffer);
        console.log('Image saved as image-output.png');
    } catch (error) {
        console.log(error)
    }



}

module.exports = createImage;

