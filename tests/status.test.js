const { describe, it } = require('mocha');
const { expect } = require('chai');
const request = require('request');

describe('checks db status', () => {
  it('checks redis and mongo connection status', () => new Promise((done) => {
    request('http://0.0.0.0:5000/status', (err, resp, body) => {
      if (err) {
        done(err);
      }
      expect(JSON.parse(body)).to.deep.equal({ redis: true, db: true });
      expect(resp.statusCode).to.equal(200);
      done();
    });
  }));
});
