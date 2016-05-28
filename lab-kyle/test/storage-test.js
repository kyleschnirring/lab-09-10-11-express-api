'use strict';

const expect = require('chai').expect;
const Storage = require('../lib/storage');
const testStorage = new Storage(`${__dirname}/data`);

describe('testing module storage', function(){
  describe('testing method setItem', function(){
    before((done) => {
      testStorage.setItem('note', {id:321, content: 'test content'})
      .then((item) => {
        this.result = item;
        done();
      })
      .catch((err) => {
        this.result = err;
        done();
      });
    });

    it('should resolve a note', (done) => {
      expect(this.result.id).to.equal(321);
      expect(this.result.content).to.equal('test content');
      done();
    });
  });

  describe('testing method fetchItem', function(){
    before((done) => {
      testStorage.fetchItem('note', 321).then((item) => {
        this.result = item;
        done();
      }).catch((err) => {
        console.error(err);
        this.result = err;
        done();
      });
    });

    it('should reslove a note', (done) => {
      expect(this.result.id).to.equal(321);
      expect(this.result.content).to.equal('test content');
      done();
    });
  });


  describe('testing method deleteItem', function(){
    before((done) => {
      testStorage.deleteItem('note', 321)
      .then(() => {
        this.result = 'success';
        done();
      })
      .catch((err) => {
        this.result = err;
        done();
      });
    });

    it('should resolve undefined', (done) => {
      expect(this.result).to.equal('success');
      done();
    });
  });

});

