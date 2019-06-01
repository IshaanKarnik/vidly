const mongoose      = require('mongoose');
const Joi           = require('@hapi/joi');
const genreSchema   = require('./genres').genreSchema;

const Movie = mongoose.model('Movies', new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 1000,
        required: true
    },
    dailyRentalRate: {
        type:Number,
        min: 0,
        max: 1000,
        required: true
    }
}));

function validate(movie){
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).max(1000).required(),
        dailyRentalRate: Joi.number().min(0).max(1000).required()
    }
    return Joi.validate(movie, schema);
}

module.exports.Movie    = Movie;
module.exports.validate = validate;