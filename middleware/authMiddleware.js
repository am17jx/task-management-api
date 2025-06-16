// Task-Api/middleware/authMiddleware.js

const AppError = require('./../utils/AppError'); 
const catchAsync = require('./../utils/catchAsync'); 
const jwt = require('jsonwebtoken');
const User = require('./../Model/usermodel'); 

exports.protect = catchAsync(async (req, res, next) => {
    // 1) get the token and check if it exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // 4) check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }

        next();
    };
};