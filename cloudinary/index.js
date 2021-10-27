// Storing thingstodo details gallery images on cloudinary for redundancy purposes
const cloudinary = require('cloudinary').v2,
    { CloudinaryStorage } = require('multer-storage-cloudinary');

// associating my account with cloudinary instance
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// For gallery
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Samples1',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    transformation: [{
            width: 1450,
            height: 1000
            }],
    }
});

module.exports = {
    // cloudinary instance
    cloudinary,
    // gallery
    storage
}