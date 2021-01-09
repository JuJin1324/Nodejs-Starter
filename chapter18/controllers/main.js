const fortune = require('../lib/fortune');

module.exports = {
    registerRoutes: function(app) {
        app.get('/', this.home);
        app.get('/about', this.about);
        app.get('/thank-you', this.thankYou);
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
};
