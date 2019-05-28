const _                     = require('lodash');
const express               = require('express');
//const mongoose  = require('mongoose');
//const Joi       = require('@hapi/joi');
const {Customer, validate} = require('../models/customers');
const router    = express.Router();


router.get('/', async (req, res) => {   
    res.status(200).send(await Customer.find().sort('name'));
});

router.get('/:id', async (req, res) => {   
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send(`Record with id ${req.params.id} not found`);

    res.status(200).send(_.pick(customer, ['_id', 'name', 'phone', 'isGold']));
});


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = new Customer(_.pick(req.body, ['name', 'phone', 'isGold']));
    res.status(200).send(_.pick(await customer.save(), ['_id', 'name', 'phone', 'isGold']));
});

router.put('/:id', async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findOneAndUpdate({_id: req.params.id}, _.pick(req.body, ['name', 'phone', 'isGold']), {new: true});
    if(!customer) return res.status(404).send(`Record with id ${req.params.id} not found`);

    res.status(200).send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findOneAndDelete({_id: req.params.id});
    if(!customer) return res.status(404).send(`Record with id ${req.params.id} not found`);
    res.status(200).send(customer);
});

module.exports = router;