var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

// creating the user schema
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    password: {
        type: String
    }
});

// generating JWT
// when this JWT is called, it will use the data from the current user model and make a jwt and return it.
userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000) // exp as Unix time in seconds
    }, process.env.JWT_SECRET);
};

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.setPassword = function(password) {
    return password = this.generateHash(password);
    console.log('password is ' + password);
}




// compiling the schema to a model and expose it to the app
mongoose.model('User', userSchema);