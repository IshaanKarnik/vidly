const express   = require('express');
const mongoose  = require('mongoose');
const Joi       = require('@hapi/joi');
const router    = express.Router();

const Customer = mongoose.model('Customer',  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
        },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
        },
    isGold: {
        type: Boolean,
        default: false
    }
    }));

router.get('/', async (req, res) => {   
    res.status(200).send(await Customer.find().sort('name'));
});

router.get('/:id', async (req, res) => {   
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send(`Record with id ${req.params.id} not found`);
    res.status(200).send(customer);
});


router.post('/', async (req, res) => {
    const { error } = validate_customer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({name: req.body.name});
    res.status(200).send(await customer.save());
});

router.put('/:id', async (req, res) => {
    const {error} = validate_customer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
    if(!customer) return res.status(404).send(`Record with id ${req.params.id} not found`);

    res.status(200).send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = Customer.findByIdAndRemove(req.params.id);
    if(!customer) return res.status(404).send(`Record with id ${req.params.id} not found`);
    res.status(200).send(customer);
});

function validate_customer(customer){
    const schema = {
        name: Joi.string().min(5).required()
    };
    return Joi.validate(customer, schema);
}

module.exports = router;