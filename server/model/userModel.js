const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    photo: {
        type: String,
        default: "https://res.cloudinary.com/grace26/image/upload/v1664693577/2e4566fd829bcf9eb11ccdb5f252b02f_tye4l7.jpg"
    },
    publicId: String,
    position: String,
}, {timestamps: true});

// delete password when response
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

const User = mongoose.model('User', userSchema);
module.exports = User;