'use strict';

const AppError = module.exports = function(message, status, response){
  Error.call(this);
  this.message = message;
  this.status = status;
  this.response = response;
};

AppError.prototype = Object.create(Error.prototype);

AppError.error400 = function(message){
  return new AppError(message, 400, 'bad request');
};

AppError.error404 = function(message){
  return new AppError(message, 404, 'not found');
};

AppError.error500 = function(message) {
  return new AppError(message, 500, 'internal server error');
};

AppError.isAppError = function(appErr){
  return appErr instanceof AppError;
};
