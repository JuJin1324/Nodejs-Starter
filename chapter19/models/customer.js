let mongoose = require('mongoose');
let Orders = require('./order');

let customerSchema = mongoose.Schema({
    fileName: String,
    lastName: String,
    email: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    salesNotes: [{
        date: Date,
        salespersonId: Number,
        notes: String,
    }],
});

customerSchema.methos.getOrders = () => {
    return Orders.find({customerId: this._id});
};

let Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
