const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    username: {
        type: String
    },
    taskdesc: {
        type: String,
        required: [true, "Please describe your task!"],
        unique: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    deadline: {
        type: Date,
        required: [true, "Please choose a deadline!"],
        // min: today
    },
});

taskSchema.statics.updatetask = async function (id, taskdesc, completed) {
    if (taskdesc.length == 0) {
        throw Error("desc blank");
    }

    const update = {
        taskdesc: taskdesc,
        completed: completed,
    }
    const filter = { id };
    let task = await Task.findOneAndUpdate(filter, update, {
        new: true
    });
    return task
};


const Task = mongoose.model('Task', taskSchema)
module.exports = Task;