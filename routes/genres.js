const express           = require('express');
const router            = express.Router();
const {Genre, validate} = require('../models/genres');
const auth              = require('../middlewares/auth');
const admin             = require('../middlewares/admin');
router.get('/', async (req, res) => {   
    res.status(200).send(await Genre.find().sort('name'));
});

router.get('/:id', async (req, res) => {   
    const genre = await Genre.findOne({_id: req.params.id});
    if(!genre) return res.status(404).send(`Record with id ${req.params.id} not found`);
    res.status(200).send(genre);
});


router.post('/', [auth, admin], async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({name: req.body.name});
    res.status(200).send(await genre.save());
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findOneAndUpdate({_id: req.params.id}, {name: req.body.name}, {new: true});
    if(!genre) return res.status(404).send(`Record with id ${req.params.id} not found`);

    res.status(200).send(genre);
});

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findOneAndDelete({_id: req.params.id});
    if(!genre) return res.status(404).send(`Record with id ${req.params.id} not found`);
    res.status(200).send(genre);
});

module.exports = router;