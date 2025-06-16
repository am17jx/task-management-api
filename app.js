const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const AppError = require('./utils/AppError'); 
const globalErrorHandler = require('./controllers/errorController'); 
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/TaskRoutes');
const cors = require('cors'); 

const app = express();

app.use(cors()); 
app.options('*', cors()); 


app.use(express.json()); // للسماح بقراءة بيانات JSON القادمة
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use('/api/users', userRouter);
app.use('/api/task', taskRouter);

// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 3) GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;