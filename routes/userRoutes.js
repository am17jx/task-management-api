const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const authMiddleware = require('./../middleware/authMiddleware');

const router = express.Router();

// ------------------- المسارات العامة (يجب أن تكون هنا) -------------------
// هذه المسارات لا تتطلب تسجيل دخول
router.post('/signup', authController.singup);
router.post('/login', authController.login);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// ------------------- تطبيق الـ Middleware -------------------
// من هذه النقطة، كل المسارات التالية ستكون محمية وتتطلب تسجيل دخول
router.use(authMiddleware.protect);

// المسارات المحمية التي تتطلب من المستخدم أن يكون مسجلاً دخوله
router.patch('/updateMyPassword', authController.updatePassword);

// من هذه النقطة، كل المسارات التالية تتطلب صلاحيات "admin"
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