// Task-Api/routes/TaskRoutes.js

const express = require('express');
const { protect } = require('../middleware/authMiddleware');


const taskController = require('../controllers/taskController');

const router = express.Router();

router.use(protect);

router
  .route('/getalltask')
  .get(taskController.filterUserTask, taskController.getAllTasks);


router
  .route('/createtask')
  .post(taskController.setTaskUserIds,taskController.createTask);

/*
* ------------------- التعديل هنا -------------------
* قم بوضع دالة التحقق من الملكية أولاً في كل المسارات
*/
router
  .route('/:id')
  .get(taskController.checkTaskOwnership, taskController.getTask)       // <-- الترتيب الصحيح
  .patch(taskController.checkTaskOwnership, taskController.updateTask)   // <-- الترتيب الصحيح
  .delete(taskController.checkTaskOwnership, taskController.deleteTask); // <-- الترتيب الصحيح

module.exports = router;