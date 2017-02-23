import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import monk from 'monk';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import winstonInstance from './winston';
import dotenv from 'dotenv';

import APIError from './helpers/APIError';
import routes from './routes/index';

const app = express();

const debug = process.env.NODE_ENV === 'development';

if (debug) {
  app.use(logger('dev'));
  dotenv.config({path: ".env.server"});

  app.use(cors());
}

const env = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const host = env.DB_HOST || "mongo";
const port = env.DB_PORT || "27017";

const url = `${env.DB_USER}:${env.DB_PASS}@${host}:${port}/${env.DB_NAME}`;
const db = monk(url);

app.use(function(req, res, next){
  req.db = db;
  next();
});

if (env.NODE_ENV === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');

  // exclude /assets from logger
  app.use(/\/((?!assets).)*/, expressWinston.logger({
    winstonInstance,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true
  }));
}

app.use('/api', routes);

app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

app.use((err, req, res, next) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: env.NODE_ENV === 'development' ? err.stack : {}
  })
);

export default app;
