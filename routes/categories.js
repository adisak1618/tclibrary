var express = require('express');
var router = express.Router();
const models = require('./../models');

/* list all categories. */
router.get('/', async (req, res, next) => {
  const categories = await models.category.findAll({
    raw: true,
  });
  res.render('index', { title: 'Express', categories: categories });
});

module.exports = router;
