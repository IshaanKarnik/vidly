const express   = require('express');
const mongoose  = require('mongoose');
const Joi       = require('@hapi/joi');
const router    = express.Router();

const Genre = mongoose.model('Genre',  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
        }
    }));

router.get('/', async (req, res) => {   
    res.status(200).send(await Genre.find().sort('name'));
});

router.get('/:id', async (req, res) => {   
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send(`Record with id ${req.params.id} not found`);
    res.status(200).send(genre);
});


router.post('/', async (req, res) => {
    const { error } = validate_genre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({name: req.body.name});
    res.status(200).send(await genre.save());
});

router.put('/:id', async (req, res) => {
    const {error} = validate_genre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
    if(!genre) return res.status(404).send(`Record with id ${req.params.id} not found`);

    res.status(200).send(genre);
});

router.delete('/:id', async (req, res) => {
    const genre = Genre.findByIdAndRemove(req.params.id);
    if(!genre) return res.status(404).send(`Record with id ${req.params.id} not found`);
    res.status(200).send(genre);
});

function validate_genre(genre){
    const schema = {
        name: Joi.string().min(5).required()
    };
    return Joi.validate(genre, schema);
}

module.exports = router;