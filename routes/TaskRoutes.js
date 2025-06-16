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
router
  .route('/:id')
  .get(taskController.checkTaskOwnership, taskController.getTask)      
  .patch(taskController.checkTaskOwnership, taskController.updateTask)  
  .delete(taskController.checkTaskOwnership, taskController.deleteTask); 

module.exports = router;
