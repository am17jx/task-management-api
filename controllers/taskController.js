const catchAsync = require('../utils/catchAsync');
const Task = require('./../Model/taskmodel');
const factory=require('./../controllers/handlerfactory');
const AppError =require('./../utils/AppError')

// Task-Api/controllers/taskController.js

exports.filterUserTask= (req,res,next)=>{
  req.filter = {user :req.user.id};
  next();

};

exports.setTaskUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.checkTaskOwnership = catchAsync(async(req,res,next)=>{
  const task = await Task.findById(req.params.id);
  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }
  if(task.user.toString() !== req.user.id){
    return next (
      new AppError('You do not have permission to perform this action', 403) // 403 معناها Forbidden
    
  )}
  next();


})

exports.getAllTasks=factory.getAll(Task);
 exports.createTask = factory.createOne(Task);
 exports.updateTask = factory.updateOne(Task);
 exports.deleteTask = factory.deleteOne(Task);

 exports.getTask = factory.getOne(Task);
//  exports.updateMe = (req, res, next) => {
//     req.params.id = req.user.id; // أو أي ID مخصص
//     next();
//   };