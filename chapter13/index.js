const http = require('http');
const express = require('express');
const expressHandlebars = require('express3-handlebars');
const bodyParser = require('body-parser');
const weather = require("./weather");
const formidable = require('formidable');
const cookieParser = require('cookie-parser');
const session = require('express-session');
/* Added in chapter11 */
const nodemailer = require('nodemailer');
const credentials = require('./credentials');
let emailService = require('./lib/email')(credentials);
const winston = require('./config/winston');

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

// for now, we're mocking NewsletterSignup:
function NewsletterSignup(){
}
NewsletterSignup.prototype.save = function(cb){
    cb();
};

// mocking product database
function Product(){
}
Product.find = function(conditions, fields, options, cb){
    if(typeof conditions==='function') {
        cb = conditions;
        conditions = {};
        fields = null;
        options = {};
    } else if(typeof fields==='function') {
        cb = fields;
        fields = null;
        options = {};
    } else if(typeof options==='function') {
        cb = options;
        options = {};
    }
    var products = [
        {
            name: 'Hood River Tour',
            slug: 'hood-river',
            category: 'tour',
            maximumGuests: 15,
            sku: 723,
        },
        {
            name: 'Oregon Coast Tour',
            slug: 'oregon-coast',
            category: 'tour',
            maximumGuests: 10,
            sku: 446,
        },
        {
            name: 'Rock Climbing in Bend',
            slug: 'rock-climbing/bend',
            category: 'adventure',
            requiresWaiver: true,
            maximumGuests: 4,
            sku: 944,
        }
    ];
    cb(null, products.filter(function(p) {
        if(conditions.category && p.category!==conditions.category) return false;
        if(conditions.slug && p.slug!==conditions.slug) return false;
        if(isFinite(conditions.sku) && p.sku!==Number(conditions.sku)) return false;
        return true;
    }));
};
Product.findOne = function(conditions, fields, options, cb){
    if(typeof conditions==='function') {
        cb = conditions;
        conditions = {};
        fields = null;
        options = {};
    } else if(typeof fields==='function') {
        cb = fields;
        fields = null;
        options = {};
    } else if(typeof options==='function') {
        cb = options;
        options = {};
    }
    Product.find(conditions, fields, options, function(err, products){
        cb(err, products && products.length ? products[0] : null);
    });
};

const VALID_EMAIL_REGEX = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

let mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: credentials.gmail.user,
        pass: credentials.gmail.password
    }
});

/* You can use SMTP in direct way
 * But if you use Gmail or Hotmail or well known MSA services, use above. */
// let mailTransprt = nodemailer.createTransport({
//     host: 'stmp.gmail.com',
//     secureConnection: true,
//     post: 465,
//     auth: {
//         user: credentials.gmail.user,
//         pass: credentials.gmail.password
//     }
// });

app.get('/email/send', (req, res) => {
    emailService.send('jujin1324@daum.net', 'Your test email.',
        '<h1>Thank you for volunteering this testing. Version3</h1>\n' +
        '<p>We are so grateful. ' +
        '<b>We look forward to your visit!</b></p>\n' +
        '<p><img src="http://placehold.it/100x100" alt="bluecube"></p>');
});

const cartValidation = require('./lib/cartValidation.js');

app.use(cartValidation.checkWaivers);
app.use(cartValidation.checkGuestCounts);

app.post('/cart/add', function(req, res, next) {
    let cart = req.session.cart || (req.session.cart = {items: []});
    Product.findOne({sku: req.body.sku}, function(err, product) {
        if (err) return next(err);
        if (!product) return next(new Error('Unknown product SKU: ' + req.body.sku));
        cart.items.push({
            product: product,
            guests: req.body.guests || 0,
        });
        res.redirect(303, '/cart');
    });
});

app.get('/cart', function(req, res, next) {
    let cart = req.session.cart;
    if (!cart) next();
    res.render('cart', {cart: cart});
});

app.get('/cart/checkout', function(req, res, next) {
    let cart = req.session.cart;
    if (!cart) next();
    res.render('cart-checkout');
});

app.get('/cart/thank-you', (req, res) => {
    res.render('cart-thank-you', {cart: req.session.cart});
});

app.get('/email/cart/thank-you', (req, res) => {
    res.render('email/cart-thank-you', {cart: req.session.cart, layout: null});
});

app.post('/cart/checkout', (req, res, next) => {
    let cart = req.session.cart;
    if (!cart) next(new Error('Cart does not exist.'));
    let name = req.body.name || '', email = req.body.email || '';
    if (!email.match(VALID_EMAIL_REGEX))
        return next(new Error('Invalid email address.'));
    cart.number = Math.random().toString().replace(/^0\.0*/, '');
    cart.billing = {
        name: name,
        email: email
    };

    res.render('email/cart-thank-you', {
        layout: null, cart: cart
    }, (err, html) => {
        if (err) console.log('error in email template');
        mailTransport.sendMail({
            from: '"Meadowlark Travel": info@meadowlarktravel.com',
            to: cart.billing.email,
            subject: 'Thank you for Book your Trip with Meadowlark',
            html: html,
            generateTextFromHtml: true
        }, err => {
            if (err) console.error('Unable to send confirmation: ' + err.stack);
        });
    });
    res.render('cart-thank-you', {cart: cart});
});

app.post('/newsletter', (req, res) => {
    let name = req.body.name || '', email = req.body.email || '';
    if (!email.match(VALID_EMAIL_REGEX)) {
        if (req.xhr) return res.json({error: 'Invalid name email address.'});
        req.session.flash = {
            type: 'danger',
            intro: 'Validation error!',
            message: 'The email address you entered was not valid',
        };
        return res.redirect(303, '/newsletter/archive');
    }
    new NewsletterSignup({name: name, email: email}).save((err) => {
        if (err) {
            if (req.xhr) return res.json({error: 'Database error.'});
            req.sesssion.flash = {
                type: 'danger',
                intro: 'Database error!',
                message: 'There was a database error; please try again later.',
            };
            return res.redirect(303, '/newsletter/archive');
        }
        if (req.xhr) return res.json({success: true});
        req.session.flash = {
            type: 'success',
            intro: 'Thank you!',
            message: 'You have now been signed up for the newsletter.',
        };
        res.cookie('name', name);
        res.cookie('email', email, {signed: true});
        return res.redirect(303, '/newsletter/archive');
    });
});

app.get('/newsletter/archive', (req, res) => {
    res.render('newsletter/archive');
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

app.get('/', (req, res) => {
    res.render('home');
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
    console.log(`Form (from querystring): ${req.query.form}`);
    console.log(`CSRF toekn (from hidden form field): ${req.body._csrf}`);
    console.log(`Name (from visible form field): ${req.body.name}`);
    console.log(`Email (from visible form field): ${req.body.email}`);

    if (req.xhr || req.accepts('json,html') === 'json') {
        res.send({success: true});
    } else {
        res.redirect(303, '/thank-you');
    }
});

app.get('/thank-you', (req, res) => {
    res.render('thank-you');
});

app.use((req, res, next) => {
    res.status(404);
    res.render('404');
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
