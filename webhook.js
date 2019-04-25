// const queryString = require('query-string');
// const { defaultMenuId } = require('./config');
const { replyMessage, parseQueryString, client } = require('./helper');
const { createRichMenu } = require('./helper/createRichMenu');
const models = require('./models');
const handler = require('./handler');

module.exports = async (event) => {
  console.log('event log', event);
  const [user, created] = await models.line_user.findOrCreate({
    where: {
      lineid: event.source.userId,
    },
    // include: {
    //   model: models.user,
    //   as: 'user',
    // },
    defaults: {
      lineid: event.source.userId,
    }
  });

  if(created) {
    await client.linkRichMenuToUser(event.source.userId, 'richmenu-b6009976de63aeafa92a5facb3e628d0');
  }

  if (event.type === 'follow') {
    const msg = [{ type: 'text', text: 'สวัสดี :)' }];
    return replyMessage(event.replyToken, msg);
  } else {
    const action = await models.action.findAndCountAll({
      where: {
        success: false,
      },
      // raw: true,
    })

    console.log('action123', action);

    if(action.count > 0) { // have action to do
      const actionData = action.rows[0];
      return handler[actionData.job](event, actionData, user)
    } else { // no action to do
      if(event.type === 'postback') {
        const { name, query } = parseQueryString(event.postback.data)
        if (name in handler) {
          handler[name](event, null, user, query);
        } else {
          return replyMessage(event.replyToken, [{ type: 'text', text: 'บางอย่างเกิดผิดพลาด' }]);
        }
      } else {
        // else
        return replyMessage(event.replyToken, [{ type: 'text', text: 'line://app/1568430904-l1vn8QGG' }]);
      }
    }
  };
}