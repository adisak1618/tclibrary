'use strict';
require('dotenv').config()
const line = require('@line/bot-sdk');
const express = require('express');
const handleEvent = require('./webhook');
const config = require('./line_config');
const Routes = require('./routes');

// create Express app
// about Express itself: https://expressjs.com/
const app = express();
app.set('view engine', 'pug')

// register a webhook handler with middleware
// about the middleware, please refer to doc

app.get('/callback', (req, res) => {
  res.send('success');
});

app.use('/', Routes);
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// listen on port
const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`listening on ${port}`);
// });

module.exports = app;