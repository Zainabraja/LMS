const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    html: {
        type: Boolean,
        default: false
    },
    css: {
        type: Boolean,
        default: false
    },
    js: {
        type: Boolean,
        default: false
    },
    node: {
        type: Boolean,
        default: false
    },
});

// taskSchema.statics.updatetask = async function (id, taskdesc, completed) {
//     if (taskdesc.length == 0) {
//         throw Error("desc blank");
//     }

//     const update = {
//         taskdesc: taskdesc,
//         completed: completed,
//     }
//     const filter = { id };
//     let task = await Task.findOneAndUpdate(filter, update, {
//         new: true
//     });
//     return task
// };

const Task = mongoose.model('Task', taskSchema)
module.exports = Task;