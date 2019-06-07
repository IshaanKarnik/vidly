const _                     = require('lodash');
const express               = require('express');
const Genre                 = require('../models/genres').Genre;
const { Movie, validate }   = require('../models/movies');
const router                = express.Router();
const validateObjectId      = require('../middlewares/validateObjectId');

router.get('/', async(req, res) => {
    res.status(200).send(_.pick(await Movie.find().sort('title'), ['_id', 'title', 'numberInStock', 'dailyRentalRate']));
});

router.get('/:id', validateObjectId, async(req, res) => {
    const movies = await Movie.findById(req.params.id).sort('title');
    if(!movies) return res.status(404).json({error:`No entry found with id ${req.params.id}`});
    res.status(200).send(_.pick(movies, ['_id', 'title', 'numberInStock', 'dailyRentalRate']));
});

router.delete('/:id', validateObjectId, async (req, res) => {
    const movies = await Movie.findOneAndRemove({_id: req.params.id}, {useFindAndModify: false});
    if(!movies) return res.status(404).json({error:`No entry found with id ${req.params.id}`});
    res.status(200).send(_.pick(movies, ['_id', 'title', 'numberInStock', 'dailyRentalRate']));
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(!error) return res.status(400).json({error:error.details[0].message});

    const genre = await Genre.findById(req.body.genre._id);
    if(!genre) return res.status(404).json({error:`Invalid genres id ${genres}`});

    const movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name : genre.name
        }
    });

    res.status(200).send(await movie.save());
});

module.exports = router;