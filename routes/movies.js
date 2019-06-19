const _                     = require('lodash');
const express               = require('express');
const Genre                 = require('../models/genres').Genre;
const { Movie, validate }   = require('../models/movies');
const router                = express.Router();
const validateObjectId      = require('../middlewares/validateObjectId');

router.get('/', async(req, res) => {
    const movies = await Movie.find().sort('title').select('-__v');
    res.status(200).send(movies);
});

router.get('/:id', validateObjectId, async(req, res) => {
    const movies = await Movie.findById(req.params.id);
    if(!movies) return res.status(404).json({error:`No entry found with id ${req.params.id}`});
    res.status(200).send(_.pick(movies, ['_id', 'title', 'numberInStock', 'dailyRentalRate', 'genre']));
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
    if(!genre) return res.status(404).json({error:`Invalid genres id ${req.body.genre._id}`});

    const movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name : genre.name
        }
    });

    res.status(200).json(await movie.save());
});

router.put('/:id', validateObjectId, async (req, res) => {
    const { error } = validate(req.body);
    if(!error) return res.status(400).json({error:error.details[0].message});

    const genre = await Genre.findById(req.body.genre._id);
    if(!genre) return res.status(404).json({error:`Invalid genres id ${req.body.genre._id}`});

    const movie = await Movie.findOneAndUpdate({_id: req.params.id}, 
        {
            title: req.body.title,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
            genre: {
                _id: genre._id,
                name : genre.name
            }
        },
        { new: true }
    );

    if(!movie) return res.status(404).send('The movie with the given ID was not found.');
    
    res.status(200).json(movie);
});

module.exports = router;