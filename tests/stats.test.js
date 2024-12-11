const { describe, it } = require('mocha');
const { expect } = require('chai');
const request = require('request');

describe('returns collection in db stats', () => {
  it('returns the amount of users and files in db', (done) => {
    request('http://0.0.0.0:5000/stats', (err, resp, body) => {
      if (err) {
        done(err);
      }
      expect(resp.statusCode).to.be.equal(200);
      expect(body).to.have.property('users');
      expect(body).to.have.property('files');
      done();
    });
  });
});
