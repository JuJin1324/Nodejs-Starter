let express = require('express'),
    hbs = require('express3-handlebars'),
    indexRouter = require('../routes/index'),
    fs = require('fs')
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

app.use(indexRouter);
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

app.use((req, res) => {
    res.status(404);
    res.render('404');
});

exports.app = app;
