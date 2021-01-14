module.exports = (req, res, next) => {
    let cart = req.session.cart;
    if (!cart) return next();
    if (cart.some(item => item.product.requiresWaiver)) {
        if (!cart.warnings) cart.warnings = [];
        cart.warnings.push('One or more of your selected tours requires a waiver.');
    }
    next();
};