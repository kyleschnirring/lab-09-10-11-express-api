'use strict';

// environment variables
const port = process.env.PORT || 3000;
const storageDir = process.env.STORAGE_DIR = `${__dirname}/data`;

// npm modules
const co = require('co');
const expect = require('chai').expect;

// app modules
const server = require('../server');
const mockData = require('./lib/mock-data');

// globals && modules with dipendencies
const baseUrl = `localhost:${port}/api`;
const request = require('./lib/request')(baseUrl);

describe('testing module list-router', function(){
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
    after((done) => {
      co((function* (){
        mockData.rmTempTypeFileWithId(storageDir, 'list', this.id);
        done();
      }).bind(this)).catch(done);
    });

    it('should return a list', (done) => {
      co((function* (){
        const testList = {name: 'todo'};
        const url ='/list';
        const res = yield request.post(url)
          .send(testList);
        this.id = res.body.id;
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('todo');
        expect(res.body.noteIDs.length).to.equal(0);
        done();
      }).bind(this)).catch(done);
    });
  });

  describe('testing get method', () => {
    before((done) => {
      co((function* (){
        yield mockData.mkTempTypeFile(storageDir, 'list');
        done();
      }).bind(this)).catch(done);
    });

    after((done) => {
      co((function* (){
        yield mockData.rmTempTypeFile(storageDir, 'list');
        done();
      }).bind(this)).catch(done);
    });

    it('should return a list', (done) => {
      co((function* (){
        const url =`/list/${mockData.templist.id}`;
        const res = yield request.get(url);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('todo');
        expect(res.body.noteIDs.length).to.equal(0);
        done();
      }).bind(this)).catch(done);
    });
  });

  describe('testing delete method', () => {
    before((done) => {
      co((function* (){
        yield mockData.mkTempTypeFile(storageDir, 'list');
        done();
      }).bind(this)).catch(done);
    });

    after((done) => {
      co((function* (){
        yield mockData.rmTempTypeFile(storageDir, 'list');
        done();
      }).bind(this)).catch(done);
    });

    it('should return "success"', (done) => {
      co((function* (){
        const url =`/list/${mockData.templist.id}`;
        const res = yield request.del(url);
        expect(res.status).to.equal(200);
        expect(res.body.msg).to.equal('success');
        done();
      }).bind(this)).catch(done);
    });
  });

  describe('testing /api/list/:id/note post  method', () => {
    before((done) => {
      co((function* (){
        yield mockData.mkTempTypeFile(storageDir, 'list');
        yield mockData.mkTempTypeFile(storageDir, 'note');
        done();
      }).bind(this)).catch(done);
    });

    after((done) => {
      co((function* (){
        yield mockData.rmTempTypeFile(storageDir, 'note');
        yield mockData.rmTempTypeFile(storageDir, 'list');
        done();
      }).bind(this)).catch(done);
    });

    it('should return "success"', (done) => {
      co((function* (){
        const url =`/list/${mockData.templist.id}/note`;
        const res = yield request.post(url)
        .send({id: mockData.tempnote.id});
        expect(res.status).to.equal(200);
        expect(res.body.id).to.equal(mockData.templist.id);
        done();
      }).bind(this)).catch(done);
    });
  });
});
