'use strict';

const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const co = require('co');
const debug = require('debug')('demo:note-router');
const Note = require('../model/note');
const Promise= require('bluebird');

function createNote(req, storage){
  debug('enter createNote');
  var note;
  const content = req.body.content;
  try {
    note = new Note(content);
  } catch (err) {
    return Promise.reject(err);
  }
  return storage.setItem('note', note);
}

function fetchNote(req , storage){
  debug('fetchNote');
  const id = req.params.id;
  return storage.fetchItem('note', id);
}

function deleteNote(req, storage){
  debug('deleteNote');
  const id = req.params.id;
  return storage.deleteItem('note', id);
}

module.exports = function(storage){
  debug('module');
  const noteRouter = Router();
  noteRouter.use(bodyParser);
  noteRouter.post('/', function(req, res){
    debug('HIT /api/note POST');
    co(function* (){
      var note = yield createNote(req, storage);
      return res.status(200).json(note);
    }).catch((err) => {
      res.sendError(err);
    });
  });

  noteRouter.get('/:id', function(req, res){
    debug('HIT /ap/note/:id GET');
    co(function* (){
      var note = yield fetchNote(req, storage);
      return res.status(200).json(note);
    }).catch((err) => {
      res.sendError(err);
    });
  });

  noteRouter.delete('/:id', function(req, res){
    debug('HIT /api/note/:id DELETE');
    co(function* (){
      yield deleteNote(req, storage);
      return res.status(200).json({msg: 'success'});
    }).catch((err) => {
      res.sendError(err);
    });
  });

  return noteRouter;
};
