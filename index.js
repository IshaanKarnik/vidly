const express   = require('express');
const helmet    = require('helmet');
const morgan    = require('morgan');
const Joi       = require('@hapi/joi');
const app       = express();

let genres = [
    {id: 1, name: 'Action'},
    {id: 2, name: 'Horror'},
    {id: 3, name: 'Drama'}
];

app.use(express.json());
app.use(helmet());
if(app.get('env') === 'development')    app.use(morgan('short'));

app.get('/api/genres', (req, res) => {
    res.status(200).send(genres);
});

app.post('/api/genres', (req, res) => {
    const { error } = validate_genre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        name : req.body.name
    };
    genres.push(genre);
    res.status(200).send(genre);
});

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send(`Record with id ${req.params.id} not found`);

    const {error} = validate_genre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;
    res.status(200).send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
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

const port_no = process.env.PORT || 3000;
app.listen(port_no, () => console.log(`Listening on port number ${port_no}`));