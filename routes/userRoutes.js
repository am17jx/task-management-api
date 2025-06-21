const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const authMiddleware = require('./../middleware/authMiddleware');

const router = express.Router();


router.post('/signup', authController.singup);
router.post('/login', authController.login);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authMiddleware.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.use(authMiddleware.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
