// title, dueDate, status

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({


    title : {
        type:String,
        required: [true, 'A user must have a Title'],
    },

    dueDate:[Date],

    status :{
        type : String,
        enum: ['In Progress ▶', 'Completed ✅', 'Cancelled ❌', 'Blocked ❗'],

    },

    user  : {
        type:mongoose.Schema.ObjectId,
        ref : "User",
        required:[true, 'Task must belong to a user']

    }



})
const Task = mongoose.model('Task', TaskSchema);


module.exports=Task;