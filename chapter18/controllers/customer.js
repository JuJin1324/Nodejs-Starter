let Customer = require('../models/customer');
let customerViewModel = require('../viewModels/customer');

module.exports = {
    registerRoutes: app => {
        app.get('/customer/:id', this.home);
        app.get('/customer/:id/preferences', this.preferences);
        app.get('/orders/:id/preferences', this.preferences);

        app.post('/customer/:id/update', this.ajaxUpdate);
    },
    home: (req, res, next) => {
        let customer = Customer.findById(req.params.id);
        if (!customer) return next();
        customer.getOrders((err, orders) => {
            if (err) return next(err);
            res.render('customer/home', customerViewModel(customer, orders));
        });
    },
    preferences: (req, res, next) => {
        Customer.findById(req.params.id, (err, customer) => {
            if (err) return next(err);
            if (!customer) return next();
            customer.getOrders((err, orders) => {
                if (err) return next(err);
                res.render('customer/preferences', customerViewModel(customer, orders));
            });
        });
    },
    ajaxUpdate: (req, res, next) => {
        Customer.findById(req.params.id, (err, customer) => {
            if (err) return next(err);
            if (!customer) return next();
            if (req.body.firstName) {
                if (typeof req.body.firstName !== 'string' ||
                    req.body.firstName.trim() === '')
                    return res.json({error: 'Invalid name.'});
                customer.firstName = req.body.firstName;
            }
            // and so on ...
            customer.save(err => {
                return err ? res.json({error: 'Unable to update customer.'}) : res.json({success: true});
            });
        });
    },
};
