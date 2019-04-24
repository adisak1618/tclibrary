// const queryString = require('query-string');
// const { defaultMenuId } = require('./config');
const { replyMessage, parseQueryString, client } = require('./helper');
// const models = require('./models');
// const handler = require('./handler');

module.exports = async (event) => {
  console.log('event log', event);
  // const [user, created] = await models.line_user.findOrCreate({
  //   where: {
  //     lineid: event.source.userId,
  //   },
  //   include: [
  //     {
  //       model: models.user,
  //       as: 'user',
  //       include: {
  //         model: models.shop,
  //         as: 'shop',
  //       }
  //     }
  //   ],
  //   defaults: {
  //     lineid: event.source.userId,
  //   }
  // });

  // if(created) {
  //   await client.linkRichMenuToUser(event.source.userId, defaultMenuId);
  // }

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

    if(action.count > 0) { // have action to do
      const actionData = data.rows[0];
      return handler[actionData.job](event, action, user)
    } else { // no action to do
      if(event.type === 'postback') {
        console.log('postback webhook');
        // const data = parseQueryString(event.postback.data)
        // console.log('queryString', data);
        // const name = data.name;
        // if (name in handler) {
        //   handler[name](event, null, user)
        // } else {
        //   return replyMessage(event.replyToken, [{ type: 'text', text: 'บางอย่างเกิดผิดพลาด' }, mainMenu(user)]);
        // }
      } else {
        // else
      }
    }
  };
}