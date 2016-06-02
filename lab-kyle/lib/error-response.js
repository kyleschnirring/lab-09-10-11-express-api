'use strict';

const AppError = require('./app-error');
const debug = require('debug')('demo:error-response');
module.exports = function(req, res, next){
  res.sendError = function(err){
    debug('sendError');
    console.error(err.message);
    if (AppError.isAppError(err)){
      debug('isAppError returned true');
      res.status(err.status).send(err.response);
      return;
    }
    res.status(500).send('internal server error');
  };
  next();
};
