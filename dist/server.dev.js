"use strict";

var dotenv = require('dotenv');

var mongoose = require('mongoose'); // It's a good practice to handle uncaught exceptions at the top


process.on('uncaughtException', function (err) {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({
  path: './config.env'
});

var app = require('./app');

if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  console.error('FATAL ERROR: Missing DATABASE or DATABASE_PASSWORD in .env file.');
  process.exit(1);
}

var DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(function () {
  console.log('DB connection successful!');
});
var port = process.env.PORT || 3700;
var server = app.listen(port, function () {
  console.log("Server listening on port ".concat(port));
}); // Handle unhandled promise rejections

process.on('unhandledRejection', function (err) {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(function () {
    process.exit(1);
  });
});