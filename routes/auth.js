const User      = require('../models/users').User;
const jwt       = require('jsonwebtoken');
const Joi       = require('@hapi/joi');
const express   = require('express');
const _         = require('lodash');
const router    = express.Router();

router.post('/', async (req, res, next) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json({error: 'Invalid E-Mail or Password'});

    user = _.pick(user, ['_id', 'isAdmin']);
    
    const token = await jwt.sign(user, 'TestSecret');

});

function validate(auth){
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(schema, auth);
}

module.exports = router;