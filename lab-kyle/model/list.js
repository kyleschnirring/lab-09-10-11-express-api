'use strict';
const uuid = require('node-uuid');
const AppError = require('../lib/app-error');

module.exports = function(name){
  if (!name){
    throw AppError.error400('list constructor requires name');
  }
  this.id = uuid.v4();
  this.name = name;
  this.noteIDs = [];
};
