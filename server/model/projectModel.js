const { Schema, model } = require("mongoose");

const projectModel = new Schema({
    title: String,
    description: String,
    languages: Array,
    image: String,
    publicId: String,
    status: {
        type: String,
        enum: ["Not Started", "In Progress", "Completed"],
        default: "Not Started"
    },
    membersId: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
});

const Project = model('Project', projectModel);
module.exports = Project;