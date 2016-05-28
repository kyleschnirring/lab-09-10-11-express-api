'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const co = require('co');
const AppError = require('./app-error');
const debug = require('debug')('demo:storage');
const Promise = require('bluebird');

const Storage = module.exports = function(rootDir){
  if (!rootDir) throw new Error('storage module requires rootDir');
  this.rootDir = rootDir;
  debug(`init storage with rootDir ${this.rootDir}`);
  mkdirp(this.rootDir, function(err){
    if (err) {
      console.error(err);
      err = AppError.error500(`Storage could not make rootDir: ${this.rootDir}`);
      throw err;
    }
  });
};

Storage.prototype.typeDirExists = function(type){
  debug('typeDirExists');
  return new Promise((resolve, reject) => {
    fs.stat(`${this.rootDir}/${type}`, (err) => {
      if (err) {
        err = AppError.error404(`Storage type: ${type} not found`);
        return reject(err);
      }
      resolve();
    });
  });
};


Storage.prototype.assertTypeDir = function(type){
  debug('assertTypeDir');
  return new Promise((resolve, reject) => {
    co((function*(){
      yield this.typeDirExists(type);
      resolve();
    }).bind(this)).catch(() => {
      co((function*(){
        yield this.mkTypeDir(type);
        resolve();
      }).bind(this)).catch((err) => {
        console.error(err);
        err = AppError.error500(`Storage unable to create type dir: ${type} `);
        reject(err);
      });
    });
  });
};

Storage.prototype.mkTypeDir = function(type){
  debug('mkTypeDir');
  return new Promise((resolve, reject) => {
    mkdirp(`${this.rootDir}/${type}`, function(err){
      if (err) {
        err = AppError.error500('could note make type dir');
        return reject(err);
      }
      resolve();
    });
  });
};

Storage.prototype.deleteItemFile = function(type, id){
  debug('deleteItemFile');
  return new Promise((resolve, reject) => {
    const filepath = `${this.rootDir}/${type}/${id}`;
    fs.unlink(filepath, function(err){
      if (err) {
        err = AppError.error404(`item file not found: ${filepath}`);
        return reject(err);
      }
      resolve();
    });
  });
};

Storage.prototype.readItemFile = function(type, id){
  debug('readItemFile');
  return new Promise((resolve, reject) => {
    const filepath = `${this.rootDir}/${type}/${id}`;
    fs.readFile(filepath, function(err, data){
      if (err) {
        err = AppError.error404(`item file not found: ${filepath}`);
        return reject(err);
      }

      try {
        const item = JSON.parse(data);
        resolve(item);
      } catch (err){
        reject(AppError.error500(`could not parse item file: ${filepath}`));
      }
    });
  });
};

Storage.prototype.writeItemFile = function(type, item){
  debug('writeItemFile');
  return new Promise((resolve, reject) => {
    const filepath = `${this.rootDir}/${type}/${item.id}`;
    fs.writeFile(filepath, JSON.stringify(item), (err) => {
      if (err) {
        err = AppError.error500(`could not write item file:${filepath}`);
        return reject(err);
      }
      resolve(item);
    });
  });
};

Storage.prototype.setItem = function(type, item){
  debug('setItem');
  return new Promise((resolve, reject) => {
    co((function* () {
      yield this.assertTypeDir(type);
      yield this.writeItemFile(type, item);
      resolve(item);
    }).bind(this)).catch((err) => {
      reject(err);
    });
  });
};

Storage.prototype.fetchItem = function(type, id){
  debug('fetchItem');
  return new Promise((resolve, reject) => {
    co((function*(){
      yield this.typeDirExists(type);
      var item = yield this.readItemFile(type, id);
      resolve(item);
    }).bind(this)).catch((err) => {
      reject(err);
    });
  });
};

Storage.prototype.deleteItem = function(type, id){
  debug('deleteItem');
  return new Promise((resolve, reject) => {
    co((function*(){
      yield this.typeDirExists(type);
      yield this.deleteItemFile(type, id);
      resolve();
    }).bind(this)).catch((err) => {
      reject(err);
    });
  });
};
