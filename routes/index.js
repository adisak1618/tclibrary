var express = require('express');
var router = express.Router();
var categoriesRoutes = require('./categories');
var apiRoutes = require('./api');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/category', categoriesRoutes);

router.use('/api/v1', apiRoutes);
module.exports = router;
