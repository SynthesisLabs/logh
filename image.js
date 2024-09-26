const { createCanvas, loadImage } = require('canvas');

class MusicCard {
    /**
     * @hideconstructor
     */
    constructor() {
        this.song = '';
        this.artist = '';
        this.album = '';
        this.cover = '';
        this.songStart = '';
        this.songDuration = '';
    }

    /**
     * Set the song name
     * @param {string} song Song name
     * @returns {MusicCard}
     */
    setSong(song) {
        this.song = song.toString();
        return this;
    }

    /**
     * Set the artist name
     * @param {string} artist Artist name
     * @returns {MusicCard}
     */
    setArtist(artist) {
        this.artist = artist.toString();
        return this;
    }

    /**
     * Set the album name
     * @param {string} album Album name
     * @returns {MusicCard}
     */
    setAlbum(album) {
        this.album = album.toString();
        return this;
    }

    /**
     * Set cover image
     * @param {string||path} image Cover image
     * @returns {MusicCard}
     */
    setCover(image) {
        this.cover = image;
        return this;
    }

    /**
     * Set song start and duration time
     * @param {string} start Start time song
     * @param {string} duration Song duration
     * @returns {MusicCard}
     */
    setTime(start, duration) {
        this.songStart = start;
        this.songDuration = duration;
        return this;
    }

    /**
     * Creating the MusicCard
     */
    async build() {
        const width = 800;
        const height = 440;
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext("2d")

        // Background
        ctx.fillStyle = '#1c1c1c';
        ctx.fillRect(0, 0, width, height);

        // Now Playing Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(`Now Playing:`, 50, 100);

        // Song Name
        ctx.font = 'bold 48px Arial';
        ctx.fillText(this.song, 50, 180);

        // Artist Name
        ctx.font = 'italic 36px Arial';
        ctx.fillText(`By ${this.artist}`, 50, 260);


        // Album Name
        ctx.font = 'bold 28px Arial';
        ctx.fillText(`Album: ${this.album}`, 50, 320);

        // Draw Progress Bar
        const barWidth = 700; // Total width of the progress bar
        const barHeight = 20;  // Height of the progress bar
        const barX = 50;       // X position
        const barY = 350;      // Y position

        // Calculate the percentage of the song that has been played
        const progressPercent = this.songStart / this.songDuration;

        // Background of the progress bar (gray)
        ctx.fillStyle = '#555';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Foreground (the filled part) of the progress bar (green)
        ctx.fillStyle = '#3ec6f4';
        ctx.fillRect(barX, barY, barWidth * progressPercent, barHeight);

        // Timestamp
        ctx.font = 'bold 24px Arial';
        const startTimeText = formatTime(this.songStart); // Current position
        const endTimeText = formatTime(this.songDuration);  // Song duration

        // Draw start and end times at the ends of the progress bar
        ctx.fillStyle = '#ffffff';
        ctx.fillText(startTimeText, barX, barY + 40); // Start time on the left
        ctx.fillText(endTimeText, barX + barWidth - ctx.measureText(endTimeText).width, barY + 40); // End time on the right

        // Load and draw the image from URL
        const image = await loadImage(this.cover); // Use the image URL passed as a parameter
        const imageWidth = 240; // Desired width for the image
        const imageHeight = (image.height / image.width) * imageWidth; // Maintain aspect ratio

        // Position the image in the top right corner
        ctx.drawImage(image, width - imageWidth - 50, 50, imageWidth, imageHeight); // Top right corner with padding

        try {
            // Save the image to file
            return await canvas.toBuffer('image/png');
        } catch (error) {
            console.log(error)
        }


        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }
    }
}

module.exports = { MusicCard };