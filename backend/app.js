require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('odin-blog-api:app');

const postsRouter = require('./routes/posts');
const commentRouter = require('./routes/comments');
const userRouter = require('./routes/users');

const app = express();
const mongodb = process.env.MONGODB;

async function main() {
  await mongoose.connect(mongodb);
}

main().catch((err) => debug(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', postsRouter);
app.use('/posts/:postId/comments', commentRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  const response = {
    message: err.message,
    status: err.status || 500,
    stack: err.stack,
  };

  res.json(response);
});

module.exports = app;
