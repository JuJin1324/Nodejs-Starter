let assert = require('chai').assert,
    axios = require('axios')
;

suite('API tests', () => {
    let base = 'http://api.jujin.com:3000';
    let attraction = {
        lat: 45.516011,
        lng: -122.682062,
        name: 'Portland Art Museum',
        description: 'Founded in 1892, the Portland Art Museum\'s colleciton ' +
            'of native art is not to be missed.  If modern art is more to your ' +
            'liking, there are six stories of modern art for your enjoyment.',
        email: 'test@meadowlarktravel.com',
    };

    test('should be able to add an attraction', done => {
        axios.post(`${base}/attraction`, attraction).then(res => {
            let data = res.data;
            /* 정규표현식 \w: Alphanumeric character => [A-Za-z0-9_] */
            assert.match(data.id, /\w/, 'id must be set');
            done();
        }).catch(reason => {
            console.log('axios post failed:', reason);
        });
    });

    test('should be able to approve an attraction', done => {
        axios.post(`${base}/attraction/approve-all`).then(res => {
            let approveData = res.data;
            assert.match(approveData.id, /\w/, 'id must be approved');
            done();
        });
    });

    test('should be able to retrieve an attraction', done => {
        axios.post(`${base}/attraction`, attraction).then(res => {
            let data = res.data;
            axios.get(`${base}/attraction/${data.id}`).then(res => {
                let data = res.data;
                assert(data.name === attraction.name);
                assert(data.description === attraction.description);
                done();
            });
        }).catch(reason => {
            console.log('axios post failed:', reason);
        });
    });
});
