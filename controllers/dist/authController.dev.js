"use strict";

var AppError = require('./../utils/AppError');

var catchAsync = require('./../utils/catchAsync');

var jwt = require('jsonwebtoken');

var crypto = require('crypto');

var User = require('./../Model/usermodel');

var sendEmail = require('./../utils/email');

var signToken = function signToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

var createSendToken = function createSendToken(user, statusCode, res) {
  var token = signToken(user._id);
  var cookieOptions = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: {
      user: user
    }
  });
};

exports.singup = catchAsync(function _callee(req, res, next) {
  var newUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.create(req.body));

        case 2:
          newUser = _context.sent;
          createSendToken(newUser, 201, res);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.login = catchAsync(function _callee2(req, res, next) {
  var _req$body, email, password, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password; // 1) Check if email and password exist

          if (!(!email || !password)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", next(new AppError('Please provide email and password!', 400)));

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }).select('+password'));

        case 5:
          user = _context2.sent;
          _context2.t0 = !user;

          if (_context2.t0) {
            _context2.next = 11;
            break;
          }

          _context2.next = 10;
          return regeneratorRuntime.awrap(user.correctPassword(password, user.password));

        case 10:
          _context2.t0 = !_context2.sent;

        case 11:
          if (!_context2.t0) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", next(new AppError('Incorrect email or password', 401)));

        case 13:
          // 3) If everything ok, send token to client
          createSendToken(user, 200, res);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.forgetPassword = catchAsync(function _callee3(req, res, next) {
  var user, resetToken, resetURL, message;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 2:
          user = _context3.sent;

          if (user) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", next(new AppError('There is no user with email address.', 404)));

        case 5:
          //2) generate the random reset token
          resetToken = user.createPasswordResetToken();
          _context3.next = 8;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 8:
          //  3) Send it to user's email
          resetURL = "http://127.0.0.1:5500/frontend/reset-password.html?token=".concat(resetToken);
          message = "\u0646\u0633\u064A\u062A \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643\u061F \u0627\u0636\u063A\u0637 \u0639\u0644\u0649 \u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u062A\u0627\u0644\u064A \u0644\u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646\u0647\u0627: ".concat(resetURL, "\n\n\u0625\u0630\u0627 \u0644\u0645 \u062A\u0643\u0646 \u0623\u0646\u062A \u0645\u0646 \u0637\u0644\u0628 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0639\u064A\u064A\u0646\u060C \u064A\u0631\u062C\u0649 \u062A\u062C\u0627\u0647\u0644 \u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A.");
          _context3.prev = 10;
          _context3.next = 13;
          return regeneratorRuntime.awrap(sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message: message
          }));

        case 13:
          res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
          });
          _context3.next = 23;
          break;

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](10);
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          _context3.next = 22;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 22:
          return _context3.abrupt("return", next(new AppError('There was an error sending the email. Try again later!'), 500));

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[10, 16]]);
});
exports.resetPassword = catchAsync(function _callee4(req, res, next) {
  var hashedToken, user;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {
              $gt: Date.now()
            }
          }));

        case 3:
          user = _context4.sent;

          if (user) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", next(new AppError('Token is invalid or has expired', 400)));

        case 6:
          user.password = req.body.password;
          user.passwordConfirm = req.body.passwordConfirm;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          _context4.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          createSendToken(user, 200, res);

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.updatePassword = catchAsync(function _callee5(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user.id).select('+password'));

        case 2:
          user = _context5.sent;
          _context5.next = 5;
          return regeneratorRuntime.awrap(user.correctPassword(req.body.passwordCurrent, user.password));

        case 5:
          if (_context5.sent) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", next(new AppError('Incorrect password', 401)));

        case 7:
          user.password = req.body.password;
          user.passwordConfirm = req.body.passwordConfirm;
          _context5.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          createSendToken(user, 200, res);

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  });
});

exports.logout = function (req, res) {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: 'success'
  });
};