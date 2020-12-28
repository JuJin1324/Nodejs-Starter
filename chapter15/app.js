let fs = require('fs'),
    http = require('http'),
    express = require('express'),
    expressHandlebars = require('express3-handlebars'),
    bodyParser = require('body-parser'),
    weather = require("./weather"),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    mongoose = require('mongoose'),
    credentials = require('./credentials'),
    logger = require('./config/logger'),
    indexRouter = require('./routes/index'),
    apiRouter = require('./routes/api'),
    vhost = require('vhost')
;

let app = express();
let handlebars = expressHandlebars.create({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

const opts = {
    keepAlive: 1,
    poolSize: 2,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    promiseLibrary: global.Promise,
};

switch (app.get('env')) {
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, opts).then(() => {
            logger.info('Connected to DEV MongoDB by mongoose');
        });
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, opts).then(() => {
            logger.info('Connected to PROD MongoDB by mongoose');
        });
        break;
    default:
        throw new Error(`Unknown execution enviorment: ${app.get('env')}`);
}

let server;
app.use((req, res, next) => {
    let domain = require('domain').create();
    domain.on('error', err => {
        logger.error('DOMAIN ERROR CAUGHT\n', err.stack);
        try {
            setTimeout(() => {
                logger.error('Failsafe shutdown.');
                process.exit(1);
            }, 5000);
            let worker = require('cluster').worker;
            if (worker) worker.disconnect();
            server.close();

            try {
                next(err);
            } catch (error) {
                logger.error('Express error mechanism failed.\n', error.stack);
                res.statusCode = 500;
                res.setHeader('content-type', 'text/plain');
                res.end('Server error.');
            }
        } catch (error) {
            logger.error('Unable to send 500 response.\n', error.stack);
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
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
}));

app.use((req, res, next) => {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

app.use((req, res, next) => {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = weather.getData();
    next();
});

app.use((req, res, next) => {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

// app.use('/', indexRouter);
// app.use('/api', apiRouter);
app.use(vhost('api.*.*', apiRouter.app));
app.use(vhost('jujin.com', indexRouter.app));

let autoViews = {};
app.use((req, res, next) => {
    let path = req.path.toLowerCase();
    /* check cache; if it's there, render the view */
    if (autoViews[path]) return res.render(autoViews[path]);
    /* if it's not in the cache, see if there's a .handlebars file that matches */
    if (fs.existsSync(`${__dirname}/views/${path}.handlebars`)) {
        autoViews[path] = path.replace(/^\//, '');
        return res.render(autoViews[path]);
    }
    next();
});

app.use((req, res) => {
    res.status(404);
    res.render('404');
});

const startServer = () => {
    server = http.createServer(app).listen(app.get('port'), () => {
        logger.info(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`);
    });
};

if (require.main === module) {
    /* application run directly; start app server */
    startServer();
} else {
    /* application imported as a module via "require": export function to create server */
    module.exports = startServer;
}
