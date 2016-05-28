'use strict';

const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const co = require('co');
const debug = require('debug')('demo:list-router');
const AppError = require('../lib/app-error');
const Promise = require('bluebird');

const List = require('../model/list');

function saveList(list, storage){
  debug('enter saveList');
  return storage.setItem('list', list);
}

function createList(reqBody, storage){
  debug('enter createList');
  var list;
  try {
    list = new List(reqBody.name);
  } catch (err) {
    return Promise.reject(err);
  }
  return saveList(list, storage);
}


function fetchList(id, storage){
  debug('enter fetchList');
  return storage.fetchItem('list', id);
}

function deleteList(id, storage){
  debug('enter deleteList');
  return storage.deleteItem('list', id);
}

function assertNoteExists(reqBody, storage){
  debug('enter assertNoteExists');
  return new Promise((resolve, reject) => {
    if (!reqBody.id){
      return reject(AppError.error400('did not povide note id'));
    }
    storage.fetchItem('note', reqBody.id).then(() => {
      resolve(reqBody.id);
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports = function(storage){
  debug('enter module');

  const listRouter = Router();
  listRouter.use(bodyParser);

  listRouter.post('/', function(req, res){
    debug('HIT /API/LIST POST');
    co(function* (){
      var list = yield createList(req.body, storage);
      return res.status(200).json(list);
    }).catch((err) => {
      res.sendError(err);
    });
  });

  listRouter.get('/:id', function(req, res){
    debug('HIT /API/LIST/:id GET');
    co(function* (){
      var list = yield fetchList(req.params.id, storage);
      return res.status(200).json(list);
    }).catch((err) => {
      res.sendError(err);
    });
  });

  listRouter.delete('/:id', function(req, res){
    debug('HIT /API/LIST/:id DELETE');
    co(function* (){
      yield deleteList(req.params.id, storage);
      return res.status(200).json({msg: 'success'});
    }).catch((err) => {
      res.sendError(err);
    });
  });

  listRouter.post('/:id/note', function(req, res){
    debug('HIT /API/LIST/:ID/note POST');
    co(function* (){
      let id = yield assertNoteExists(req.body, storage);
      let list = yield fetchList(req.params.id, storage);
      list.noteIDs.push(id);
      list = yield saveList(list, storage);
      return res.status(200).json(list);
    }).catch((err) => {
      res.sendError(err);
    });
  });

  return listRouter;
};
