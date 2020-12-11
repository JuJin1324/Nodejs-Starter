let loadtest = require('loadtest');
let expect = require('chai').expect;

suite('Stress tests', () => {
    test('Homepage shoud handle 100 requests in a second', done => {
        let options = {
            url: 'http://localhost:3000',
            concurrency: 4,
            maxRequests: 100
        };
        loadtest.loadTest(options, (err, result) => {
            expect(!err);
            expect(result.totalTimeSeconds < 1);
            done();
        });
    });
});
