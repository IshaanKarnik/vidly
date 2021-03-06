const mongoose  = require('mongoose');
const Joi       = require('@hapi/joi');
const config    = require('config');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 100,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        unique : true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 256,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('user', userSchema);

function validate(user){
    const schema = {
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().min(5).max(255).required().email().unique(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}

module.exports = {
    User: User,
    validate: validate
};