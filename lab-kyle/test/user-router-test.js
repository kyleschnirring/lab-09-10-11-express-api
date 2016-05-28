'use strict';

// envirnonment vars
const port = process.env.PORT || 3000;
process.env.STORAGE_DIR = `${__dirname}/data`;

// npm modules
const co = require('co');
const expect = require('chai').expect;

// app modules
const server = require('../server');

// globals // modules with global dependencies
const baseUrl = `localhost:${port}/api`;
const request = require('./lib/request')(baseUrl);

describe('testing module user-router', function(){
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
      const testUser = {username: 'slugneo', email: 'slug@slug.com'};
      co((function* (){
        const url ='/user';
        const res = yield request.post(url).send(testUser);
        this.user = res.body;
        this.res = res;
        done();
      }).bind(this)).catch(done);
    });

    it('should return a user', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.username).to.equal('slugneo');
      expect(this.res.body.email).to.equal('slug@slug.com');
    });
  });

  describe('testing get method', () => {
    before((done) => {
      co((function*(){
        const url =`/user/${this.user.id}`;
        const res = yield request.get(url);
        this.res = res;
        done();
      }).bind(this)).catch(done);
    });

    it('should return a user', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.username).to.equal('slugneo');
      expect(this.res.body.email).to.equal('slug@slug.com');
    });
  });

  describe('testing delete method', () => {
    before((done) => {
      co((function*(){
        const url =`/user/${this.user.id}`;
        const res = yield request.del(url);
        this.res = res;
        done();
      }).bind(this)).catch(done);
    });

    it('should return "success"', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.msg).to.equal('success');
    });
  });
});
