'use strict';

const debug = require('debug')('note:storage');
const AppError = require('./app-error');
exports.pool = {};

exports.setItem = function(schema, item){
  debug('setItem');
  return new Promise((resolve, reject) => {
    if (!item.id) {
      var err = AppError.error400('storage setItem requires id');
      return reject(err);
    }
    if (!this.pool[schema]) this.pool[schema] = {};
    this.pool[schema][item.id] = item;
    resolve(item);
  });
};

exports.updateItem = function(schema, id, item) {
  debug('updateItem');
  return new Promise((resolve, reject)=>{
    if (!id) {
      var err = AppError.error400('bad request');
      return reject(err);
    }
    if(!this.pool[schema]){
      err = AppError.error404('storage schema not found');
      return reject(err);
    }
    if(!this.pool[schema][id]){
      err = AppError.error404('ID not found');
      return reject(err);
    }
    if(item.content) {
      this.pool[schema][id].content = item.content;
    } else {
      err = AppError.error400('bad request');
      return reject(err);
    }
    resolve(this.pool[schema][id]);
  });
};


exports.fetchItem = function(schema, id){
  debug('fetchItem');
  return new Promise((resolve, reject) => {
    if (!this.pool[schema]){
      var err = AppError.error404('storage schema not found');
      return reject(err);
    }
    if (!this.pool[schema][id]){
      err = AppError.error400('bad request');
      return reject(err);
    }
    resolve(this.pool[schema][id]);
  });
};

exports.deleteItem = function(schema, id){
  debug('deleteItem');
  return new Promise((resolve, reject) => {
    if (!this.pool[schema]){
      var err = AppError.error404('storage schema not found');
      return reject(err);
    }
    if (!this.pool[schema][id]){
      err = AppError.error404('storage item not found');
      return reject(err);
    }
    delete this.pool[schema][id];
    resolve(true);
  });
};
