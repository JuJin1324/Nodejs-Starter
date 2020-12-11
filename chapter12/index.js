const http = require('http');
const express = require('express');
const expressHandlebars = require('express3-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const credentials = require('./credentials');
const winston = require('./config/winston');



let app = express();
app.enable('trust proxy');
let handlebars = expressHandlebars.create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

let server;
app.use((req, res, next) => {
    let domain = require('domain').create();
    domain.on('error', err => {
        winston.error('DOMAIN ERROR CAUGHT\n', err.stack);
        try {
            setTimeout(() => {
                winston.error('Failsafe shutdown.');
                process.exit(1);
            }, 5000);
            let worker = require('cluster').worker;
            if (worker) worker.disconnect();
            server.close();

            try {
                next(err);
            } catch (error) {
                winston.error('Express error mechanism failed.\n', error.stack);
                res.statusCode = 500;
                res.setHeader('content-type', 'text/plain');
                res.end('Server error.');
            }
        } catch (error) {
            winston.error('Unable to send 500 response.\n', error.stack);
        }
    });

    domain.add(req);
    domain.add(res);

    domain.run(next);
});

app.use(express.static(__dirname + '/public'));
/* parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({extended: false}));
/* parse application/json */
app.use(bodyParser.json());
/* use cookies in express */
app.use(cookieParser(credentials.cookieSecret));
/* use session in express */
app.use(session({
    secret: credentials.cookieSecret,
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

app.use((req, res, next) => {
    let cluster = require('cluster');
    if (cluster.isWorker) winston.info(`Worker ${cluster.worker.id} received request.`);
    next();
});

app.get('/', (req, res) => {
    res.send('<h1>Home Page.</h1>');
});

app.get('/fail', (req, res) => {
    throw new Error('Nope!');
});

app.get('/epic-fail', (req, res) => {
    process.nextTick(() => {
        throw new Error('Kaboom!');
    });
});

app.use((req, res, next) => {
    res.status(404);
    res.render('404');
});

app.use((err, req, res, next) => {
    winston.error(err.stack);
    res.status(500).render('500');
});

const startServer = () => {
    server = http.createServer(app).listen(app.get('port'), () => {
        winston.info(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`);
    });
};

if (require.main === module) {
    /* application run directly; start app server */
    startServer();
} else {
    /* application imported as a module via "require": export function to create server */
    module.exports = startServer;
}
