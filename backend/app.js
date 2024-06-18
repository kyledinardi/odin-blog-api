require('dotenv').config();
require('./helper/passport');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('odin-blog-api:app');
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');

const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

const app = express();
const mongodb = process.env.MONGODB;

async function main() {
  await mongoose.connect(mongodb);
}

main().catch((err) => debug(err));

const limiter = RateLimit({
  windowsMs: 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  const response = {
    error: {
      message: err.message,
      status: err.status || 500,
      stack: err.stack,
    },
  };

  res.json(response);
});

module.exports = app;
