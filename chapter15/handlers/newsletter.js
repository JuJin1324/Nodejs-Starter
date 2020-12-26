const credentials = require('../credentials');
const emailService = require('../lib/email')(credentials);
const logger = require('../config/logger');

// for now, we're mocking NewsletterSignup:
function NewsletterSignup() {
}

NewsletterSignup.prototype.save = function(cb) {
    cb();
};

exports.getNewsletterNormal = (req, res) => {
    res.render('newsletter/newsletter-normal', {csrf: 'CSRF token goes here'});
};

exports.getNewsletterAjax = (req, res) => {
    res.render('newsletter/newsletter-ajax', {csrf: 'CSRF token goes here'});
};

exports.postNewsletter = (req, res) => {
    let name = req.body.name || '', email = req.body.email || '';
    if (!email.match(emailService.VALID_EMAIL_REGEX)) {
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
};

exports.getNewsletterArchive = (req, res) => {
    res.render('newsletter/archive');
};

exports.postProcessNormal = (req, res) => {
    logger.info(`Form (from querystring): ${req.query.form}`);
    logger.info(`CSRF toekn (from hidden form field): ${req.body._csrf}`);
    logger.info(`Name (from visible form field): ${req.body.name}`);
    logger.info(`Email (from visible form field): ${req.body.email}`);
    res.redirect(303, '/thank-you');
};

exports.postProcessAjax = (req, res) => {
    logger.info(`Form (from querystring): ${req.query.form}`);
    logger.info(`CSRF toekn (from hidden form field): ${req.body._csrf}`);
    logger.info(`Name (from visible form field): ${req.body.name}`);
    logger.info(`Email (from visible form field): ${req.body.email}`);

    if (req.xhr || req.accepts('json,html') === 'json') {
        res.send({success: true});
    } else {
        res.redirect(303, '/thank-you');
    }
};
