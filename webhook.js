// const queryString = require('query-string');
// const { defaultMenuId } = require('./config');
const { replyMessage, parseQueryString, client } = require('./helper');
const { uploadFromUrl} = require('./helper/upload');
const { createRichMenu } = require('./helper/createRichMenu');
const models = require('./models');
const handler = require('./handler');
const { BookTemplate } = require('./handler/messageTemplate');

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
    console.log('action.count', action.count);
    if(action.count > 0) { // have action to do
      console.log('postback wowowows');
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
        // const msg = BookTemplate({
        //   cover: 'https://s3-ap-southeast-1.amazonaws.com/tcliberry/bookcover/Jdj-1556289210400.jpg',
        //   name: 'test',
        //   category: 'test',
        //   writer: 'test',
        //   page_count: 123,
        //   publisher: 'seed',
        //   count: 2,
        //   bookid: 1
        // });
        // return replyMessage(event.replyToken, [msg]);
        // const result = await uploadFromUrl('https://developers.line.biz/assets/images/top/main-visual0-sp.png', 'adisak555');
        // console.log('s3 upload result', result);
        // else
      }
    }
  };
}