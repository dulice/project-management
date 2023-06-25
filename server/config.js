const { default: mongoose } = require("mongoose")
const cloudinary = require('cloudinary').v2;
const ConnectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = { ConnectDB, cloudinary }