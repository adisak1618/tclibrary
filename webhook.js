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

  // if (event.type === 'follow') {

  //   const echo = [{ type: 'text', text: 'สวัสดี :)' }, mainMenu(user)];
  //   await client.linkRichMenuToUser(event.source.userId, defaultMenuId);
  //   return replyMessage(event.replyToken, echo);
  // } else {
  //   var custom_order = Object.keys(handler).reverse();
  //   const data = await models.action.findAndCountAll({
  //     where: {
  //       success: false,
  //     },
  //     // raw: true,
  //   })

  //   data.rows.sort((back, front) => {
  //     const backorder = custom_order.indexOf(back.job);
  //     const frontorder = custom_order.indexOf(front.job);
  //     return frontorder - backorder;
  //   });

  //   if(data.count > 0) {
  //     const action = data.rows[0];
  //     return handler[action.job](event, action, user)
  //   } else {
  //     if(event.type === 'postback') {
  //       const data = parseQueryString(event.postback.data)
  //       console.log('queryString', data);
  //       const name = data.name;
  //       if (name in handler) {
  //         handler[name](event, null, user)
  //       } else {
  //         return replyMessage(event.replyToken, [{ type: 'text', text: 'บางอย่างเกิดผิดพลาด' }, mainMenu(user)]);
  //       }
  //     } else {
  //       const textMsg = event.message.text;
  //       if (textMsg in textCommand) {
  //         textCommand[textMsg](event, null, user);
  //       } else {
  //         return replyMessage(event.replyToken, mainMenu(user));
  //       }
  //     }
  //   }
  // }
}