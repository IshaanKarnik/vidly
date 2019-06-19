const Fawn                  = require('fawn');
const express               = require('express');
const mongoose              = require('mongoose');
const Movie                 = require('../models/movies');
const { Rental, validate }  = require('../models/rentals');
const Customer              = require('../models/customers');
const router                = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().select('-__v').sort('-dateOut');
    res.status(200).json(rentals);
});

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if(!error) return res.status(400).json({error:error.details[0].message});

    const customer = await Customer.find({ _id: req.body.customerId });
    if(!customer) return res.status(400).json({error: `No customer found for id ${req.body.customerId}`});

    const movie = await Movie.find({ _id: req.body.movieId });
    if(!movie) return res.status(400).json({error: `No movie found for id ${req.body.movieId}`});

    if(movie.numberInStock === 0) return res.status(400).json({error: `No more movies in stock for id ${req.body.movieId}`});
    let rental = new Rental({
        customer:{
            _id: req.body.customerId,
            name: req.body.customerName,
            phone: req.body.customerPhone
        },
        movie:{
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id}, {$inc: {numberInStock: -1}})
            .run();
    }
    catch(ex){
        res.status(400).json({error: ex.message});
    }
    res.status(200).json(rental);
});

module.exports  = router;