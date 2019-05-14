const express   = require('express');
const Joi       = require('@hapi/joi');
const router    = express.Router();

const genres = [
    { id: 1, name: 'Action' },  
    { id: 2, name: 'Horror' },  
    { id: 3, name: 'Romance' },  
];

router.get('/', (req, res) => {
    res.status(200).send(genres);
});

router.post('/', (req, res) => {
    const { error } = validate_genre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        name : req.body.name
    };
    genres.push(genre);
    res.status(200).send(genre);
});

router.put('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send(`Record with id ${req.params.id} not found`);

    const {error} = validate_genre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;
    res.status(200).send(genre);
});

router.delete('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send(`Record with id ${req.params.id} not found`);
    const genre_id = genres.indexOf(genre);
    genres.splice(genre_id, 1);
    res.status(200).send(genre);
});

function validate_genre(genre){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}

module.exports = router;