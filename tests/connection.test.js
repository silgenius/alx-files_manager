const { describe, it } = require('mocha');
const { expect } = require('chai');
const request = require('request');

describe('test user connetion', () => {
  it('checks user connection to the db', () => new Promise((done) => {
    request(
      {
        url: 'http://0.0.0.0:5000/connect',
        headers: {
          Authorization: 'Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=',
        },
      }, (err, resp, body) => {
        if (err) {
          done(err);
        }

        expect(resp.statusCode).to.equal(200);
        expect(body).to.have.property('token');
        done();
      },
    );
  }));

  it.todo('test with wrong user');
});
