const mongoose = require('mongoose');

let vacationSchema = mongoose.Schema({
    name: String,
    slug: String,
    category: String,
    sku: String,
    description: String,
    priceInCents: Number,
    tags: [String],
    inSeason: Boolean,
    available: Boolean,
    requiresWaiver: Boolean,
    maximumGuests: Number,
    notes: String,
    packagesSold: Number,
});
vacationSchema.methods.getDisplayPrice = () => {
    return `$${(this.priceInCents / 100).toFixed(2)}`;
};
let Vacation = mongoose.model('Vacation', vacationSchema);
module.exports = Vacation;
