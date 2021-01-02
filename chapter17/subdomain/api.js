let express = require('express'),
    apiRouter = require('../routes/api')
;

let app = express();
app.use(apiRouter);

exports.app = app;
