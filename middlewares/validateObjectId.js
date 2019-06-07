const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);

    if(!validId) return res.status(400).json({ error: 'Invalid Object Id'});

    next();
}