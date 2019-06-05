const {User, validate}  = require('../models/users');
const express           = require('express');
const argon2            = require('argon2');
const _                 = require('lodash');
const router            = express.Router();

router.post('/', async(req, res) => {
    try{
        const { error } = validate(req.body);
        if(error) return res.status(400).json({ error: error.details[0].message});
        
        let user = User(_.pick(req.body, ['name', 'email', 'password']));
        
        user.password = await argon2.hash(user.password, {
            type: argon2.argon2id,
            timeCost: 5,
            hashLength: 32
        });

        const token = user.generateAuthToken();

        res.status(200).header('x-auth-token', token).send(_.pick(await user.save(), ['_id', 'name', 'email']));
    }
    catch(ex){
        return res.status(400).send(ex.message);
    }
});

module.exports = router;