const line = require('@line/bot-sdk');
const config = require('../line_config');
const queryString = require('query-string');
const { validationResult } = require('express-validator/check');
const client = new line.Client(config);

exports.client = client;

exports.replyMessage = (replyToken, data) => {
  return client.replyMessage(replyToken, data);
}

exports.parseQueryString = (str) => {
  const splitData = str.split('?');
  let data = { name: splitData[0] };
  if (splitData.length === 2) {
    const queryData = queryString.parse(splitData[1]);
    data = { query: queryData, ...data };
  }
  return data;
}

exports.response =  (res, data, errorcode, message) => {
  if (errorcode === undefined) {
    res.json(data);
  } else {
    res.status(400).json({
      "errors": {
        "code": errorcode,
        "message": message
      }
    });
  }
};

exports.validateBody = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    next();
  }
};
