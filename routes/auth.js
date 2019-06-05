const User          = require('../models/users').User;
const Joi           = require('@hapi/joi');
const express       = require('express');
const argon2        = require('argon2');
const _             = require('lodash');
const router        = express.Router();
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).json({error: error.details[0].message});

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(401).json({error: 'Invalid E-Mail or Password'});

    const passwordMatch = await argon2.verify(user.password, req.body.password);
    if(!passwordMatch) return res.status(401).json({error: 'Invalid E-Mail or Password'});
    
    const token = user.generateAuthToken();

    res.status(200).json({token});
});

function validate(auth){
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(schema, auth);
}

module.exports = router;