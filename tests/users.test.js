const { describe, it } = require('mocha');
const { expect } = require('chai');
const request = require('request');

describe('tests new user creation', () => {
  it('tests missing email', () => new Promise((done) => {
    request.post({
      url: 'http://0.0.0.0:5000/users',
      json: true,
      body: { password: 'toto1234!' },
    }, (err, resp, body) => {
      if (err) {
        done(err);
      }
      expect(resp.statusCode).to.equal(400);
      expect(body).to.deep.equal({ error: 'Missing email' });
      done();
    });
  }));

  it('tests missing password', () => new Promise((done) => {
    request.post({
      url: 'http://0.0.0.0:5000/users',
      json: true,
      body: { email: 'bob@dylan.com' },
    }, (err, resp, body) => {
      if (err) {
        done(err);
      }
      expect(resp.statusCode).to.equal(400);
      expect(body).to.deep.equal({ error: 'Missing password' });
      done();
    });
  }));

  it('tests that user id and inputted email is returned', () => new Promise((done) => {
    request.post({
      url: 'http://0.0.0.0:5000/users',
      json: true,
      body: { email: 'bob@dylan.com', password: 'toto1234!' },
    }, (err, resp, body) => {
      if (err) {
        done(err);
      }
      expect(resp.statusCode).to.equal(201);
      expect(body).to.have.property('id');
      expect(body).to.have.property('email');
      done();
    });
  }));

  it('test using an already exist user in the db', () => new Promise((done) => {
    request.post({
      url: 'http://0.0.0.0:5000/users',
      json: true,
      body: { email: 'bob@dylan.com', password: 'toto1234!' },
    }, (err, resp, body) => {
      if (err) {
        done(err);
      }
      expect(resp.statusCode).to.equal(400);
      expect(body).to.deep.equal({ error: 'Already exist' });
      done();
    });
  }));
});
