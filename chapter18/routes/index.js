let express = require('express'),
    mainController = require('../controllers/main'),
    vacationController = require('../controllers/vacation'),
    cartController = require('../controllers/cart'),
    newsletterController = require('../controllers/newsletter'),
    contestController = require('../controllers/contest'),
    staffController = require('../controllers/staff'),
    hbs = require('express3-handlebars'),
    fs = require('fs'),
    staticMap = require('../lib/static').map
;

let app = express();
app.engine(
    'handlebars',
    hbs({
        defaultLayout: 'main',
        helpers: {
            section: function(name, options) {
                if (!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            },
            static: function(name) {
                return require('../lib/static').map(name);
            }
        }
    })
);
app.set('view engine', 'handlebars');

// app.use('/', indexRouter);
// app.use('/api', apiRouter);

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

app.use((req, res, next) => {
    let now = new Date();

    res.locals.logoImage = now.getMonth() === 1 && now.getDate() === 1 ?
        staticMap('/img/happy-new-year-2021.jpg') :
        staticMap('/img/free-image.jpg');
    next();
});

router = express.Router();

mainController.registerRoutes(router);
cartController.registerRoutes(router);
contestController.registerRoutes(router);
vacationController.registerRoutes(router);
newsletterController.registerRoutes(router);
staffController.registerRoutes(router);

app.use(router);

app.use((req, res) => {
    res.status(404);
    res.render('404');
});

exports.app = app;
