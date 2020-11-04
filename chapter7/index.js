let express = require('express');
let express_handlebars = require('express3-handlebars');
let weather = require("./weather");

let app = express();
let handlebars = express_handlebars.create({
    defaultLayout: 'main',
    helpers: {
        section: (name, options) => {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.use((req, res, next) => {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = weather.getData();
    next();
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/jquery-test', function(req, res) {
    res.render('jquery-test');
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

app.listen(app.get('port'), () => {
    console.log(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`);
});
