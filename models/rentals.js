const mongoose  = require('mongoose');
const Joi       = require('@hapi/joi');
Joi.objectId    = require('joi-objectid')(Joi);

const Rental    = mongoose.model('Retail', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255,
                trim: true
            },
            dailyRentalRate: {
                type: Number,
                min: 0,
                max: 1000,
                required: true
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));

function validate(rental){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }

    return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validate = validate;
