const winston = require('../config/winston');
const credentials = require('../credentials');
const nodemailer = require('nodemailer');
const emailService = require('../lib/email')(credentials);

// mocking product database
function Product() {
}

Product.find = function(conditions, fields, options, cb) {
    if (typeof conditions === 'function') {
        cb = conditions;
        conditions = {};
        fields = null;
        options = {};
    } else if (typeof fields === 'function') {
        cb = fields;
        fields = null;
        options = {};
    } else if (typeof options === 'function') {
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
        if (conditions.category && p.category !== conditions.category) return false;
        if (conditions.slug && p.slug !== conditions.slug) return false;
        if (isFinite(conditions.sku) && p.sku !== Number(conditions.sku)) return false;
        return true;
    }));
};
Product.findOne = function(conditions, fields, options, cb) {
    if (typeof conditions === 'function') {
        cb = conditions;
        conditions = {};
        fields = null;
        options = {};
    } else if (typeof fields === 'function') {
        cb = fields;
        fields = null;
        options = {};
    } else if (typeof options === 'function') {
        cb = options;
        options = {};
    }
    Product.find(conditions, fields, options, function(err, products) {
        cb(err, products && products.length ? products[0] : null);
    });
};

exports.postCartAdd = (req, res, next) => {
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
};

exports.getCart = (req, res, next) => {
    let cart = req.session.cart;
    if (!cart) next();
    res.render('cart/cart', {cart: cart});
};

exports.getCartCheckout = (req, res, next) => {
    let cart = req.session.cart;
    if (!cart) next();
    res.render('cart/cart-checkout');
};

exports.getCartThankYou = (req, res) => {
    res.render('cart/cart-thank-you', {cart: req.session.cart});
};

exports.getCartEmailThankYou = (req, res) => {
    res.render('cart/email/cart-thank-you', {cart: req.session.cart, layout: null});
};

let mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: credentials.gmail.user,
        pass: credentials.gmail.password
    }
});

exports.postCartCheckout = (req, res, next) => {
    let cart = req.session.cart;
    if (!cart) next(new Error('Cart does not exist.'));
    let name = req.body.name || '', email = req.body.email || '';
    if (!email.match(emailService.VALID_EMAIL_REGEX))
        return next(new Error('Invalid email address.'));
    cart.number = Math.random().toString().replace(/^0\.0*/, '');
    cart.billing = {
        name: name,
        email: email
    };

    res.render('email/cart-thank-you', {
        layout: null, cart: cart
    }, (err, html) => {
        if (err) winston.error('error in email template');
        mailTransport.sendMail({
            from: '"Meadowlark Travel": info@meadowlarktravel.com',
            to: cart.billing.email,
            subject: 'Thank you for Book your Trip with Meadowlark',
            html: html,
            generateTextFromHtml: true
        }, err => {
            if (err) winston.error('Unable to send confirmation: ' + err.stack);
        });
    });
    res.render('cart/cart-thank-you', {cart: cart});
};
