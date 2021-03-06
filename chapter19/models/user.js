let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    authId: String,
    name: String,
    email: String,
    role: String,
    created: Date,
});

let User = mongoose.model('User', userSchema);
module.exports = User;
