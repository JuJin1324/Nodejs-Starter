let express = require('express');
let express_handlebars = require('express3-handlebars');
let bodyParser = require('body-parser');
let fortune = require("./lib/fortune");
let weather = require("./weather");
let formidable = require('formidable');

let app = express();
let handlebars = express_handlebars.create({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if (!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())

app.use((req, res, next) => {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = weather.getData();
    next();
});

app.use((req, res, next) => {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/jquery-test', function(req, res) {
    res.render('jquery-test');
});

app.get('/contest/vacation-photo', (req, res) => {
    let now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(),
        month: now.getMonth()
    });
});

app.post('/contest/vacation-photo/:year/:month', (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) return res.redirect(303, '/error');
        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.redirect(303, '/thank-you');
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/basic', (req, res) => {
    res.render('basic', {
        currency: {
            name: 'US',
            abbrev: 'USD',
        },
        tours: [
            {name: 'Hood River', price: '$99.95'},
            {name: 'Oregon Coast', price: '$159.95'},
        ],
        specialsUrl: '/january-specials',
        currencies: ['USD', 'GBP', 'BTC'],
    });
});

app.get('/nursery-rhyme', (req, res) => {
    res.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme', (req, res) => {
    res.json({
        animal: 'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck'
    });
});

app.get('/newsletter-normal', (req, res) => {
    res.render('newsletter-normal', {csrf: 'CSRF token goes here'});
});

app.get('/newsletter-ajax', (req, res) => {
    res.render('newsletter-ajax', {csrf: 'CSRF token goes here'});
});


app.post('/process-normal', (req, res) => {
    console.log(`Form (from querystring): ${req.query.form}`);
    console.log(`CSRF toekn (from hidden form field): ${req.body._csrf}`);
    console.log(`Name (from visible form field): ${req.body.name}`);
    console.log(`Email (from visible form field): ${req.body.email}`);
    res.redirect(303, '/thank-you');
});

app.post('/process-ajax', (req, res) => {
    if (req.xhr || req.accepts('json,html') === 'json') {
        res.send({success: true});
    } else {
        res.redirect(303, '/thank-you');
    }
});



app.get('/tours/hood-river', (req, res) => {
    res.render('tours/hood-river');
});

app.get('/tours/oregon-coast', (req, res) => {
    res.render('tours/oregon-coast');
});

app.get('/tours/request-group-rate', (req, res) => {
    res.render('tours/request-group-rate');
});

app.get('/thank-you', (req, res) => {
    res.render('thank-you');
})

app.use((req, res, next) => {
    res.status(404);
    res.render('404');
});

app.listen(app.get('port'), () => {
    console.log(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`);
});
