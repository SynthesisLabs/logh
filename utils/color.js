const { createCanvas, loadImage } = require('canvas');

class ImageColorExtractor {
    // Method to load the image and get the color
    async getColorFromImage(imageUrl) {
        const image = await loadImage(imageUrl);

        // Create a canvas with the same size as the image
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        // Draw the image onto the canvas
        ctx.drawImage(image, 0, 0, image.width, image.height);

        // Get the image data
        const imageData = ctx.getImageData(0, 0, image.width, image.height);

        // Calculate average color
        let r = 0, g = 0, b = 0;
        const totalPixels = imageData.width * imageData.height;
        for (let i = 0; i < imageData.data.length; i += 4) {
            r += imageData.data[i];
            g += imageData.data[i + 1];
            b += imageData.data[i + 2];
        }

        // Calculate the average RGB values
        r = Math.floor(r / totalPixels);
        g = Math.floor(g / totalPixels);
        b = Math.floor(b / totalPixels);

        return `rgb(${r}, ${g}, ${b})`;  // Return the average color in RGB format
    }
}

module.exports = { ImageColorExtractor };