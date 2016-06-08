'use strict';

// set env varibales
// require node modules
// require npm modules
const expect = require('chai').expect;
const request = require('superagent');
// require app modules
const server = require('../server');
const storage = require('../lib/storage');
const Note = require('../model/note');
// setup globals add require modules dependent on gloals
const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api/note`;

describe('testing module note-router', function(){
  before((done) => {
    if (!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server running on port', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if (server.isRunning){
      server.close(() => {
        console.log('shutdown the server');
        done();
      });
      return;
    }
    done();
  });
//Testing POST
  describe('testing POST /api/note', function(){
    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return a note', function(done){
      request.post(baseUrl)
      .send({content: 'test note'})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal('test note');
        expect(!!res.body.id);
        done();
      });
    });
  });
//Testing POST bad request
  describe('testing POST /api/note with bad request', function(){
    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return a note', function(done){
      request.post(baseUrl)
      .send({wat: ''})
      .end(() => {
        it('should return a 400 and bad request', () => {
          expect(this.res.status).to.equal(400);
          expect(this.res.text).to.equal('bad request');
        });
        done();
      });
    });
  });
//Testing GET Requests
  describe('testing GET /api/note', function(){
    before((done) => {
      this.tempNote = new Note('test data');
      storage.setItem('note', this.tempNote);
      done();
    });

    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return a note', (done) => {
      request.get(`${baseUrl}/${this.tempNote.id}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal(this.tempNote.content);
        expect(res.body.id).to.equal(this.tempNote.id);
        done();
      });
    });
  });
//Testing GET 400
  describe('testing GET /api/note with bad request', function(){
    before((done) => {
      this.tempNote = new Note('test data');
      storage.setItem('note', this.tempNote);
      done();
    });

    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return a bad request', (done) => {
      request.get(`${baseUrl}/ihoguyf`)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.text).to.equal('bad request');
        done();
      });
    });
  });
//Testing GET 404
  describe('testing GET /api/note with bad id for a not found', function(){
    before((done) => {
      this.tempNote = new Note('test data');
      this.tempNote.id = 786564;
      storage.setItem('note', this.tempNote);
      done();
    });

    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return not found', (done) => {
      request.get(`localhost:${port}/api/hello/${this.tempNote.id}`)
      .end((err, res) => {
        it('should return a 404 and not found', () => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('not found');
        });
      });
      done();
    });
  });

  //Testing PUT
  describe('testing PUT /api/note with id', function(){
    before((done) => {
      this.tempNote = new Note('test data');
      storage.setItem('note', this.tempNote);
      done();
    });

    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return note.id', (done) => {
      request.put(`${baseUrl}/`)
      .send('98796857643')
      .end((err, res) => {
        //console.log('put 404');
        it('should return a 404 and a note', () => {
          expect(res.status).to.equal(404);
          expect(res.body.content).to.equal(this.tempNote.content);
          expect(res.body.id).to.equal(this.tempNote.id);
          done();
        });
      });
      done();
    });
  });

  describe('testing PUT /api/note with id', function(){
    before((done) => {
      this.tempNote = new Note('test data');
      storage.setItem('note', this.tempNote);
      done();
    });

    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return note.id', (done) => {
      request.put(`${baseUrl}/${this.tempNote.id}`)
      .send({content:'this note', id:this.tempNote.id})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal(this.tempNote.content);
        expect(res.body.id).to.equal(this.tempNote.id);
        done();
      });
    });
  });
//Testing DELETE
  describe('testing DELETE /api/note with id', function(){
    before((done) => {
      this.tempNote = new Note('test data');
      storage.setItem('note', this.tempNote);
      done();
    });

    after((done) => {
      storage.pool = {};
      done();
    });
    it('should return true', (done) => {
      request.delete(`${baseUrl}/${this.tempNote.id}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('true');
        done();
      });
    });
  });

});
