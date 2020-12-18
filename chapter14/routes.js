const main = require('./handlers/main');
const vacation = require('./handlers/vacation');
const cart = require('./handlers/cart');
const newsletter = require('./handlers/newsletter');
const contest = require('./handlers/contest');
const staff = require('./handlers/staff');

module.exports = app => {
    app.get('/', main.home);
    app.get('/about', main.about);
    app.get('/thank-you', main.thankYou);

    app.get('/set-currency/:currency', vacation.getSetCurrency);
    app.get('/vacations', vacation.getVacations);
    app.get('/notify-me-when-in-season', vacation.getNotifyMeWhenInSeason);
    app.post('/notify-me-when-in-season', vacation.postNotifyMeWhenInSeason);

    app.post('/cart/add', cart.postCartAdd);
    app.get('/cart', cart.getCart);
    app.get('/cart/checkout', cart.getCartCheckout);
    app.get('/cart/thank-you', cart.getCartThankYou);
    app.get('/cart/email/thank-you', cart.getCartEmailThankYou);
    app.post('/cart/checkout', cart.postCartCheckout);

    app.post('/newsletter', newsletter.postNewsletter);
    app.get('/newsletter/archive', newsletter.getNewsletterArchive);
    app.get('/newsletter-normal', newsletter.getNewsletterNormal);
    app.get('/newsletter-ajax', newsletter.getNewsletterAjax);
    app.post('/process-normal', newsletter.postProcessNormal);
    app.post('/process-ajax', newsletter.postProcessAjax);

    app.get('/contest/vacation-photo', contest.getContestVacationPhoto);
    app.post('/contest/vacation-photo/:year/:month', contest.postContestVacationPhoto);

    app.get('/staff/:city/:name', staff.getStaff);
};

