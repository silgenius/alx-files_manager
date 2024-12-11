const { describe, it } = require('mocha');
const expect = require('chai').expect;
const request = require('request');

describe("Checks db status", function() {
    it('checks redis and mongo connection status', function(done) {
        request('http://0.0.0.0:5000/status', (err, resp, body) => {
            if (err) {
                done(err);
            }
            expect(body).to.deep.equal({"redis":true,"db":true});
            expect(resp.statusCode).to.equal(200);
            done();
        })
    })
})