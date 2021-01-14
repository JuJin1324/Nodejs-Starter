const fortune = require('../lib/fortune');

const middleware = {
    customerOnly: (req, res, next) => {
        let user = req.session.passport.user;
        if (user && req.role === 'customer') return next();
        res.redirect(303, '/unauthorized');
    },
    employeeOnly: (req, res, next) => {
        let user = req.session.passport.user;
        if (user && req.role === 'employee') return next();
        next('route');
    },
};

module.exports = {
    registerRoutes: function(app) {
        app.get('/', this.home);
        app.get('/about', this.about);
        app.get('/thank-you', this.thankYou);
        app.get('/account', this.account);
        app.get('/account/order-history', middleware.customerOnly, this.accountOrderHistory);
        app.get('/account/email-prefs', middleware.customerOnly, this.accountEmailPrefs);
        app.get('/sales', middleware.employeeOnly, this.sales);
    },
    home: (req, res) => {
        res.render('home');
    },
    about: (req, res) => {
        res.render('about', {
            fortune: fortune.getFortune(),
            pageTestScript: '/qa/tests-about.js'
        });
    },
    thankYou: (req, res) => {
        res.render('thank-you');
    },
    account: (req, res) => {
        res.render('account');
    },
    accountOrderHistory: (req, res) => {
        res.render('account/order-history');
    },
    accountEmailPrefs: (req, res) => {
        res.render('account/email-prefs');
    },
    sales: (req, res) => {
        res.render('sales');
    },
};
