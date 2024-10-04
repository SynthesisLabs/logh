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
        this.color = {
            type: "solid",
            color: "#1c1c1c",
            topColor: "#1c1c1c",
            botColor: "#1c1c1c",
            gradientSizeFactor: 0.5,
            bar: "#3ec6f4"
        };
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
     * Set background color
     * First color top-right, second color bottom-left
     * @param {"solid" | "gradient"} type Start time song
     * @param {Array} color Song duration
     * @returns {MusicCard}
     */
    setColor(type, color1, color2, gradientSizeFactor) {
        switch (type) {
            case "solid":
                this.color.type = "solid";
                this.color.color = color1;
                return this;
            case "gradient":
                this.color.type = "gradient";
                this.color.topColor = color1;
                this.color.botColor = color2;
                this.color.gradientSizeFactor = gradientSizeFactor;
                return this;
        }
    }

    setBar(color) {
        this.color.bar = color;
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
        if (this.color.type == "gradient") {
            const gradient = ctx.createLinearGradient(width * this.color.gradientSizeFactor, 0, 0, height * this.color.gradientSizeFactor);
            gradient.addColorStop(0, `${this.color.topColor}`);
            gradient.addColorStop(1, `${this.color.botColor}`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        } else {
            ctx.fillStyle = `${this.color.color}`;
            ctx.fillRect(0, 0, width, height);
        }

        // Now Playing Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(`Now Playing:`, 50, 100);

        // Song Name
        // ctx.font = 'bold 48px Arial';
        ctx.font = applyText(canvas, this.song);
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
        ctx.fillStyle = `${this.color.bar}`;
        ctx.fillRect(barX, barY, barWidth * progressPercent, barHeight);

        // Timestamp
        ctx.font = 'bold 24px Arial';
        const startTimeText = formatTime(this.songStart); // Current position
        const endTimeText = formatTime(this.songDuration);  // Song duration

        // Draw start and end times at the ends of the progress bar
        ctx.fillStyle = '#ffffff';
        ctx.fillText(startTimeText, barX, barY + 45); // Start time on the left
        ctx.fillText(endTimeText, barX + barWidth - ctx.measureText(endTimeText).width, barY + 45); // End time on the right

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

        function applyText(canvas, text) {
            const context = canvas.getContext('2d');
        
            // Declare a base size of the font
            let fontSize = 48;
        
            do {
                // Assign the font to the context and decrement it so it can be measured again
                context.font = `bold ${fontSize -= 10}px Arial`;
                // Compare pixel width of the text to the canvas minus the approximate avatar size
            } while (context.measureText(text).width > canvas.width - 300);
        
            // Return the result to use in the actual canvas
            return context.font;
        };
    }
}

module.exports = { MusicCard };