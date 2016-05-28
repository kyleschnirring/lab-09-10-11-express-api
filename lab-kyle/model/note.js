'use strict';

const uuid = require('node-uuid');
const AppError = require('../lib/app-error');

module.exports = function(content){
  if (!content){
    throw AppError.error400('Note constructor requires contetn and authorID');
  }
  this.id = uuid.v1();
  this.content = content;
  this.timestamp = new Date();
};
