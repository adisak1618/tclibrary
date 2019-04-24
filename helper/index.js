const line = require('@line/bot-sdk');
const config = require('../line_config');
const queryString = require('query-string');
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
