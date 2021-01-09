const Vacation = require('../models/vacation');
const VacationInSeasonListener = require('../models/vacationInSeasonListener');

Vacation.find((err, vacations) => {
    if (vacations.length) return;

    new Vacation({
        name: 'Hood River Day Trip',
        slug: 'hood-river-day-trip',
        category: 'Day Trip',
        sku: 'HR199',
        description: 'Spend a day sailing on the Columbia and enjoying craft beers in Hood River!',
        priceInCents: 9995,
        tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
        inSeason: true,
        maximumGuests: 16,
        available: true,
        packagesSold: 0,
    }).save();

    new Vacation({
        name: 'Oregon Coast Gateway',
        slug: 'oregon-coast-gateway',
        category: 'Weekend Gateway',
        sku: 'OC39',
        description: 'Enjoy the ocean air and quaint coastal towns!',
        priceInCents: 269995,
        tags: ['weekend gateway', 'oregon coast', 'beach combing'],
        inSeason: false,
        maximumGuests: 8,
        available: true,
        packagesSold: 0,
    }).save();

    new Vacation({
        name: 'Rock Climbing in Bend',
        slug: 'rock-climbing-in-bend',
        category: 'Adventure',
        sku: 'B99',
        description: 'Experience the thrill of climbing in the high desert.',
        priceInCents: 289995,
        tags: ['weekend gateway', 'bend', 'high desert', 'rock climbing'],
        inSeason: true,
        requiresWaiver: true,
        maximumGuests: 4,
        available: false,
        packagesSold: 0,
        notes: 'The tour guide is currently recovering from a skiing accident.'
    }).save();
});

const convertFromUSD = (value, currency) => {
    switch (currency) {
        case 'USD':
            return value * 1;
        case 'GBP':
            return value * 0.6;
        case 'BTC':
            return value * 0.0023707918444761;
        default:
            return NaN;
    }
};

module.exports = {
    registerRoutes: function(app) {
        app.get('/set-currency/:currency', this.getSetCurrency);
        app.get('/vacations', this.getVacations);
        app.get('/notify-me-when-in-season', this.getNotifyMeWhenInSeason);
        app.post('/notify-me-when-in-season', this.postNotifyMeWhenInSeason);
    },
    getSetCurrency: (req, res) => {
        req.session.currency = req.params.currency;
        return res.redirect(303, '/vacations');
    },
    getVacations: (req, res) => {
        Vacation.find({available: true}, (err, vacations) => {
            let currency = req.session.currency || 'USD';
            let context = {
                currency: currency,
                vacations: vacations.map(vacation => {
                    return {
                        sku: vacation.sku,
                        name: vacation.name,
                        description: vacation.description,
                        inSeason: vacation.inSeason,
                        price: convertFromUSD(vacation.priceInCents / 100, currency),
                    };
                }),
            };
            switch (currency) {
                case 'USD':
                    context.currencyUSD = 'selected';
                    break;
                case 'GBP':
                    context.currencyGBP = 'selected';
                    break;
                case 'BTC':
                    context.currencyBTC = 'selected';
                    break;
            }
            res.render('vacation/vacations', context);
        });
    },
    getNotifyMeWhenInSeason: (req, res) => {
        res.render('vacation/notify-me-when-in-season', {sku: req.query.sku});
    },
    postNotifyMeWhenInSeason: (req, res) => {
        VacationInSeasonListener.updateOne(
            {email: req.body.email},
            {$push: {sku: req.body.sku}},
            {upsert: true},
            err => {
                if (err) {
                    winston.error(err.stack);
                    req.session.flash = {
                        type: 'danger',
                        intro: 'Oops!',
                        message: 'There was an error processing your request.',
                    };
                    return res.redirect(303, '/vacations');
                }
                req.session.flash = {
                    type: 'success',
                    intro: 'Thank you!',
                    message: 'You will be notified when thi vacation is in season.',
                };
                return res.redirect(303, '/vacations');
            }
        );
    },
};
