"use strict";

var express = require('express');

var helmet = require('helmet');

var morgan = require('morgan');

var rateLimiter = require('express-rate-limit');

var AppError = require('./utils/AppError');

var globalErrorHandler = require('./controllers/errorController');

var userRouter = require('./routes/userRoutes');

var taskRouter = require('./routes/TaskRoutes');

var cors = require('cors');

var app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json()); // للسماح بقراءة بيانات JSON القادمة
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers

app.use(helmet()); // Development logging

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} // Limit requests from same API


var limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
app.use(express.json({
  limit: '10kb'
})); // Test middleware

app.use(function (req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
}); // 2) ROUTES

app.use('/api/users', userRouter);
app.use('/api/task', taskRouter); // Handle unhandled routes

app.all('*', function (req, res, next) {
  next(new AppError("Can't find ".concat(req.originalUrl, " on this server!"), 404));
}); // 3) GLOBAL ERROR HANDLING MIDDLEWARE

app.use(globalErrorHandler);
module.exports = app;