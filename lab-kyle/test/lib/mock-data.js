'use strict';

const fs = require('fs');
const co = require('co');
const Promise = require('bluebird');
const debug = require('debug')('demo:test-data');
const List = require('../../model/list');
const Type = require('../../model/note');

exports.tempnote = new Type('test content', '123');
exports.templist = new List('todo');

exports.tempTypeFilePath = function(storagedir, type){
  return `${storagedir}/${type}/` +  this[`temp${type}`].id;
}

exports.tempTypeDirPath = function(storagedir, type){
  return `${storagedir}/${type}`;
}

exports.tempTypeDirExist = function(storagedir, type){
  return new Promise((resolve, reject) => {
    const dirPath = this.tempTypeDirPath(storagedir, type);
    fs.stat(dirPath, (err, stats) => {
      if (err) return reject(err);
      debug('dir exists');
      resolve();
    });
  });
}

exports.mkTempTypeDir = function(storagedir, type){
  return new Promise((resolve, reject) => {
    co((function* (){
      yield this.tempTypeDirExist(storagedir, type);
      resolve();
      debug('made dir');
    }).bind(this)).catch((err) => {
      const dirPath = this.tempTypeDirPath(storagedir, type);
      fs.mkdir(dirPath , (err) => {
        if (err) return reject(err);
        debug('made dir');
        resolve();
      });
    });
  });
};

exports.tempTypeFileExist = function(storagedir, type){
  return new Promise((resolve, reject) => {
    const filepath = this.tempTypeFilePath(storagedir, type);
    fs.stat(filepath, (err, stats) => {
      if (err) return reject(err);
      debug('file exits');
      resolve();
    });
  });
}

exports.mkTempTypeFile = function(storagedir, type){
  return new Promise((resolve, reject) => {
    debug('this.tempType', this.tempType);
    co((function *(){
      yield this.tempTypeFileExist(storagedir, type);
      resolve();
    }).bind(this)).catch((err) => {
      co((function* (){
        yield this.mkTempTypeDir(storagedir, type);
        const filepath = this.tempTypeFilePath(storagedir, type);
        const data = JSON.stringify(this[`temp${type}`]);
        fs.writeFile(filepath, data, function(err){
          if (err) return reject(err);
          resolve();
          debug('made file');
        });
      }).bind(this)).catch((err) => {
        reject(err);
      })
    });;
  });
};

exports.rmTempTypeFile = function(storagedir, type){
  return new Promise((resolve, reject) => {
    co((function *(){
      yield this.tempTypeFileExist(storagedir, type);
      const filepath = this.tempTypeFilePath(storagedir, type);
      fs.unlink(filepath, function(err){
        if (err) return reject(err);
        debug('removed file');
        resolve();
      });
    }).bind(this)).catch((err) => {
      debug('removed file');
      resolve();
    });
  });
};

exports.rmTempTypeFileWithId = function(storagedir, type, id){
  return new Promise((resolve, reject) => {
    co((function *(){
      const filepath = `${this.tempTypeDirPath(storagedir, type)}/${id}`;
      fs.unlink(filepath, function(err){
        if (err) return reject(err);
        debug('removed file with id');
        resolve();
      });
    }).bind(this)).catch((err) => {
      debug('failed to remove file with id');
      resolve();
    });
  });
};
