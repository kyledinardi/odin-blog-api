require('dotenv').config();
require('./helper/passport');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const cors = require('cors');

const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

const app = express();

const limiter = RateLimit({
  windowsMs: 60 * 1000,
  max: 100,
});

app.use(cors());
app.use(limiter);
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  const response = {
    error: {
      message: err.message,
      status: err.status || 500,
      stack: err.stack,
    },
  };

  console.error(response);
  res.json(response);
});

module.exports = app;
