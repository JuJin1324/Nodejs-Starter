let express = require('express'),
    main = require('../handlers/main'),
    vacation = require('../handlers/vacation'),
    cart = require('../handlers/cart'),
    newsletter = require('../handlers/newsletter'),
    contest = require('../handlers/contest'),
    expressHandlebars = require('express3-handlebars'),
    staff = require('../handlers/staff')
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

router = express.Router();

router.get('/', main.home);
router.get('/about', main.about);
router.get('/thank-you', main.thankYou);

router.get('/set-currency/:currency', vacation.getSetCurrency);
router.get('/vacations', vacation.getVacations);
router.get('/notify-me-when-in-season', vacation.getNotifyMeWhenInSeason);
router.post('/notify-me-when-in-season', vacation.postNotifyMeWhenInSeason);

router.post('/cart/add', cart.postCartAdd);
router.get('/cart', cart.getCart);
router.get('/cart/checkout', cart.getCartCheckout);
router.get('/cart/thank-you', cart.getCartThankYou);
router.get('/cart/email/thank-you', cart.getCartEmailThankYou);
router.post('/cart/checkout', cart.postCartCheckout);

router.post('/newsletter', newsletter.postNewsletter);
router.get('/newsletter/archive', newsletter.getNewsletterArchive);
router.get('/newsletter-normal', newsletter.getNewsletterNormal);
router.get('/newsletter-ajax', newsletter.getNewsletterAjax);
router.post('/process-normal', newsletter.postProcessNormal);
router.post('/process-ajax', newsletter.postProcessAjax);

router.get('/contest/vacation-photo', contest.getVacationPhoto);
router.post('/contest/vacation-photo/:year/:month', contest.postVacationPhotoWithParams);

router.get('/staff/:city/:name', staff.getStaff);

app.use(router);
exports.app = app;
// module.exports = router;
