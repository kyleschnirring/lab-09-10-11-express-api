'use strict';

// environment variables
const port = process.env.PORT || 3000;
process.env.STORAGE_DIR = `${__dirname}/data`;

// npm modules
const co = require('co');
const uuid = require('node-uuid');
const expect = require('chai').expect;

// app modules
const server = require('../server');

// globals && module with global dependencies
const baseUrl = `localhost:${port}/api`;
const request = require('./lib/request')(baseUrl);
const userId = uuid.v4();

describe('testing module note-router', function(){
  before((done) => {
    if (!server.isRunning){
      server.listen(port, () => {
        console.log('server is running on port', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    server.close(() => {
      server.isRunning = false;
      console.log('server has terminated');
      done();
    });
  });

  describe('testing post method', () => {
    before((done) => {
      co((function* (){
        const testNote = {content: 'test content'};
        const url ='/note';
        const res = yield request.post(url)
        .send(testNote);
        this.res = res;
        this.note = res.body;
        done();
      }).bind(this)).catch(done);
    });

    it('should return a note', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.content).to.equal('test content');
    });
  });

  describe('testing get method', () => {
    before((done) => {
      co((function* (){
        const url =`/note/${this.note.id}`;
        const res = yield request.get(url);
        this.res = res;
        done();
      }).bind(this)).catch(done);
    });

    it('should return a note', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.content).to.equal('test content');
    });
  });

  describe('testing delete method', () => {
    before((done) => {
      co((function* (){
        const url =`/note/${this.note.id}`;
        const res = yield request.del(url)
        .set('UserID', userId);
        this.res = res;
        done();
      }).bind(this)).catch(done);
    });

    it('should return a "success"', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.msg).to.equal('success');
    });
  });
});
