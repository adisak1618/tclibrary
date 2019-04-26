// const queryString = require('query-string');
// const { defaultMenuId } = require('./config');
const { replyMessage, parseQueryString, client } = require('./helper');
const { uploadFromUrl} = require('./helper/upload');
const { createRichMenu } = require('./helper/createRichMenu');
const models = require('./models');
const handler = require('./handler');
const { studentTemplate } = require('./handler/messageTemplate');

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
    if(event.type === 'postback') {
      const { name, query } = parseQueryString(event.postback.data)
      if (name in handler && action.count > 0) {
        const actionToCancle = action.rows[0];
        actionToCancle.success = true;
        actionToCancle.save();
        return handler[name](event, null, user, query);
        // return replyMessage(event.replyToken, [{ type: 'text', text: 'ยกเลิกงานก่อนหน้าแล้ว' }]);
      }

      // new action
      if (name in handler) {
        return handler[name](event, null, user, query);
      }
      // something else
      // const msg = {
      //   "type": "flex",
      //   "altText": "Flex Message",
      //   "contents": {
      //     "type": "bubble",
      //     "direction": "ltr",
      //     "header": {
      //       "type": "box",
      //       "layout": "vertical",
      //       "contents": [
      //         {
      //           "type": "text",
      //           "text": "เพิ่มสมาชิก",
      //           "size": "xl",
      //           "align": "center",
      //           "weight": "bold"
      //         }
      //       ]
      //     },
      //     "body": {
      //       "type": "box",
      //       "layout": "vertical",
      //       "contents": [
      //         {
      //           "type": "text",
      //           "text": "กรุณา เลือกหมวดหมู่ที่เหมาะสมให้กับหนังสือเล่มนี้",
      //           "align": "center",
      //           "wrap": true
      //         }
      //       ]
      //     },
      //     "footer": {
      //       "type": "box",
      //       "layout": "horizontal",
      //       "contents": [
      //         {
      //           "type": "button",
      //           "action": {
      //             "type": "postback",
      //             "label": "ลงทะเบียนนักเรียน",
      //             "displayText": "ลงทะเบียนนักเรียน",
      //             "data": "registerUser"
      //           },
      //           "style": "primary"
      //         }
      //       ]
      //     }
      //   }
      // };
      // return replyMessage(event.replyToken, [msg]);
      const msg = studentTemplate();
      return replyMessage(event.replyToken, [msg]);
    }
    if(action.count > 0) { // have action to do
      const actionData = action.rows[0];
      return handler[actionData.job](event, actionData, user)
    }
  };
}