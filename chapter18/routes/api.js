let express = require('express'),
    attractionController = require('../controllers/attraction'),
    cors = require('cors')
;

router = express.Router();
let whitelist = ['http://localhost:3000', 'http://api.jujin.com']
let corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

let app = express();

attractionController.registerRoutes(app, cors(corsOptionsDelegate));

app.use(router);

exports.app = app;
