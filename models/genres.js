const mongoose  = require('mongoose');
const Joi       = require('@hapi/joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
        }
    })

const Genre = mongoose.model('Genre', genreSchema);

function validate(genre){
    const schema = {
        name: Joi.string().min(5).required()
    };
    return Joi.validate(genre, schema);
}

module.exports = {
    genreSchema: genreSchema,
    Genre: Genre,
    validate: validate
};