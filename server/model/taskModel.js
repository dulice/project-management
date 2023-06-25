const { Schema, model } = require("mongoose");

const taskModel = new Schema({
    name: String,
    isDone: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    }
},{timestamps: true});

const Task = model("Task", taskModel);
module.exports = Task
