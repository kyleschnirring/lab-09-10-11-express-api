'use strict';

const Router = require('express').Router;
const noteRouter = module.exports =  new Router();
const jsonParser = require('body-parser').json();
const sendError = require('../lib/error-response');
const debug = require('debug')('note:note-router');
const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const Note = require('../model/note');

function createNote(reqBody){
  debug('createNote');
  return new Promise(function(resolve, reject){
    var note;
    try {
      note = new Note(reqBody.content);
    } catch (err) {
      reject(err);
    }
    storage.setItem('note', note).then(function(note){
      resolve(note);
    }).catch(function(err){
      reject(err);
    });
  });
}

noteRouter.post('/', jsonParser, sendError, function(req, res){
  debug('hit endpoint /api/note POST');
  createNote(req.body).then(function(note){
    storage.setItem('note', note).then(function(note){
      //console.log('set it and forget it');
      res.status(200).json(note);
    });
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('interal server error');
  });
});

noteRouter.get('/:id', function(req, res){
  storage.fetchItem('note', req.params.id).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('interal server error');
  });
});

noteRouter.put('/:id', jsonParser, sendError, function(req, res){
  debug('hit endpoint /api/note PUT');
  storage.updateItem('note', req.params.id, req.body).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    res.sendError(err);
  });
});

noteRouter.delete('/:id', function(req, res){
  storage.deleteItem('note', req.params.id).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('internal server error');
  });
});
