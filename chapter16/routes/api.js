let express = require('express'),
    attraction = require('../handlers/attraction'),
    cors = require('cors')
;

let app = express();
router = express.Router();
let whitelist = ['http://localhost:3000', 'http://example2.com']
let corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

router.get('/attractions', cors(corsOptionsDelegate), attraction.getAttractions);
router.post('/attraction', cors(corsOptionsDelegate), attraction.postAttraction);
router.get('/attraction/:id', cors(corsOptionsDelegate), attraction.getAttractionWithParams);
router.post('/attraction/approve-all', cors(corsOptionsDelegate), attraction.postApproveAll);

app.use(router);
exports.app = app;
// module.exports = router;
