const express = require('express');
// routes
const category = require('./category');

const router = express.Router();

router.use('/category', category);
module.exports = router;
