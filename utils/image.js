const { createCanvas, loadImage, registerFont  } = require('canvas');

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
     * @param {string} image Cover image
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
     * @param {"solid" | "gradient"} type Type of background
     * @param {RGB} color1 The color you want
     * @param {RGB} color2 The color you want
     * @param {Number} gradientSizeFactor How big you want the gradient to be
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

    /**
     * 
     * @param {RGB} color 
     * @returns 
     */
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
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

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
        ctx.font = '36px "Circular Std bold"';  // Using Circular Std font
        ctx.fillText(`Now playing:`, 50, 100);

        // Song Name
        ctx.font = applyText(canvas, this.song);  // Song name with Circular Std
        ctx.fillText(this.song, 50, 180);

        // Artist Name
        ctx.font = '36px "Circular Std book italic"';  // Artist name with Circular Std
        ctx.fillText(`By ${this.artist}`, 50, 260);

        // Album Name
        ctx.font = '28px "Circular Std bold"';  // Album name with Circular Std
        ctx.fillText(`Album: ${this.album}`, 50, 320);

        // Draw Progress Bar
        const barWidth = 700;
        const barHeight = 20;
        const barX = 50;
        const barY = 350;
        const progressPercent = this.songStart / this.songDuration;

        // Background of the progress bar
        ctx.fillStyle = '#555';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Foreground of the progress bar
        ctx.fillStyle = `${this.color.bar}`;
        ctx.fillRect(barX, barY, barWidth * progressPercent, barHeight);

        // Timestamp
        ctx.font = 'bold 24px "Circular Std bold"';  // Timestamp with Circular Std
        const startTimeText = formatTime(this.songStart);
        const endTimeText = formatTime(this.songDuration);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(startTimeText, barX, barY + 45);
        ctx.fillText(endTimeText, barX + barWidth - ctx.measureText(endTimeText).width, barY + 45);

        // Load and draw the image from URL
        const image = await loadImage(this.cover);
        const imageWidth = 240;
        const imageHeight = (image.height / image.width) * imageWidth;
        ctx.drawImage(image, width - imageWidth - 50, 50, imageWidth, imageHeight);

        try {
            return await canvas.toBuffer('image/png');
        } catch (error) {
            console.log(error);
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
                context.font = `${fontSize -= 10}px "Circular Std bold"`;
                // Compare pixel width of the text to the canvas minus the approximate avatar size
            } while (context.measureText(text).width > canvas.width - 300);
        
            // Return the result to use in the actual canvas
            return context.font;
        };
    }
}

module.exports = { MusicCard };