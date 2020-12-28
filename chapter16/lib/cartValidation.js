module.exports = {
    checkWaivers: (req, res, next) => {
        let cart = req.session.cart;
        if (!cart) return next();
        if (cart.some(item => item.product.requiresWaiver)) {
            if (!cart.warnings) cart.warnings = [];
            cart.warnings.push('One or more of your selected tours requires a waiver.');
        }
        next();
    },
    checkGuestCounts: (req, res, next) => {
        let cart = req.session.cart;
        if (!cart) return next();
        if (cart.some(item => item.guests > item.product.maxiumGuests)) {
            if (!cart.errors) cart.errors = [];
            cart.errors.push('One or more of your selected tours cannot accommodate the number' +
                'of guests you have selected.');
        }
        next();
    },
};