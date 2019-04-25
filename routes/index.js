var express = require('express');
var router = express.Router();
var categoriesRoutes = require('./categories');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/category', categoriesRoutes);

module.exports = router;
