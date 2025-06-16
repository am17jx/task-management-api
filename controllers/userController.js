const User = require('./../Model/usermodel');
const factory=require('./../controllers/handlerfactory');


exports.getAllUser=factory.getAll(User);
 exports.createUser = factory.createOne(User);
 exports.updateUser = factory.updateOne(User);
 exports.deleteUser = factory.deleteOne(User);
 exports.getUser = factory.getOne(User);
 
