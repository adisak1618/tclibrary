const { client, replyMessage } = require('../helper');
const { borrowconfirmTemplate } = require('./messageTemplate');
const models = require('../models');
const { Op, literal } = require('sequelize');

const handler = {
  user_id: {
    message: () => [{ type: 'text', text: 'รหัสนักเรียนที่จะยืมหนังสือ?' }],
    func: async (event, action) => {
      if(event.type === 'message' && event.message.type === 'text' && !isNaN(event.message.text.trim())) {
        const msg = event.message.text.trim();
        const user = await models.user.findOne({
          where: {
            user_code: msg,
          }
        });
        if (user) {
          return { user_id: user.id }
        }
        const notfoundMsg = {
          "type": "flex",
          "altText": "Flex Message",
          "contents": {
            "type": "bubble",
            "direction": "ltr",
            "header": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "ไม่พบรหัสนักเรียนนี้",
                  "size": "xl",
                  "align": "center",
                  "weight": "bold"
                }
              ]
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "ลงทะเบียนนักเรียนใหม่",
                  "align": "center",
                  "wrap": true
                }
              ]
            },
            "footer": {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "button",
                  "action": {
                    "type": "postback",
                    "label": "ลงทะเบียนนักเรียน",
                    "displayText": "ลงทะเบียนนักเรียน",
                    "data": "registerUser"
                  },
                  "style": "primary"
                }
              ]
            }
          }
        };
        return replyMessage(event.replyToken, [notfoundMsg, { type: 'text', text: 'หรือลองพิมพ์รหัสนักเรียนอื่น'}]);
      }
    }
  },
  book_id: {
    message: () => [{ type: 'text', text: 'isbn ของหนังสือที่จะยืม?' }],
    func: async (event, action) => {
      if(event.type === 'message' && event.message.type === 'text' && !isNaN(event.message.text.trim())) {
        const msg = event.message.text.trim();
        const book = await models.book.findOne({
          where: {
            isbn_code: msg,
          }
        });
        if (book) {
          return { book_id: book.id };
        }
        replyMessage(event.replyToken, [
          {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
              "type": "bubble",
              "direction": "ltr",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "ไม่พบหนังสือเล่มนี้!",
                    "size": "xl",
                    "align": "center",
                    "weight": "bold"
                  }
                ]
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "หนังสือเล่มนี้ยังไม่ได้ลงทะเบียน คุณต้องการลงทะเบียนเลยมั๊ย?",
                    "align": "center",
                    "wrap": true
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "button",
                    "action": {
                      "type": "postback",
                      "label": "เพิ่มเลย",
                      "displayText": "ตกลง",
                      "data": `addBook?isbn_code=${msg}`,
                    },
                    "style": "primary"
                  }
                ]
              }
            }
          },
          { type: 'text', text: 'หรือลองใส่ isbn ของหนังสือใหม่'}
        ]);
      }
    }
  },
  validate: {
    message: async (action) => {
      const { fullname, user_code } = await models.user.findOne({
        where: {
          id: action.data.user_id,
        }
      });
      const { cover, name: bookname } = await models.book.findOne({
        where: {
          id: action.data.book_id,
        }
      });
      const msg = borrowconfirmTemplate({ cover: `https://s3-ap-southeast-1.amazonaws.com/tcliberry/${cover}`, fullname, user_code, bookname });
      return [msg];
    },
    func: async (event, action) => {
      if(event.type === 'postback' && event.postback.data === 'yes') {
        const borrowUser = await models.user.findOne({
          where: {
            id: action.data.user_id,
          }
        });
        const borrowBook = await models.book.findOne({
          where: {
            id: action.data.book_id,
          }
        });
        if(borrowBook.count <= 0) {
          action.success = true;
          action.save();
          await replyMessage(event.replyToken, [
            { type: 'text', text: 'จำนวนหนังสือไม่พอ'}
          ]);
          throw Error('จำนวนหนังสือไม่พอ');
        }
        if(borrowBook && borrowUser) {
          return { validate: true };
        }
      } else {
        action.success = true;
        action.save();
        replyMessage(event.replyToken, [
          { type: 'text', text: 'ยกเลิกแล้ว'}
        ]);
      }
    }
  }
};

const init = async (action = { data: null }, event, user) => {
  const actionData = action.data || {};
  const requireDataList = ['user_id', 'book_id', 'validate'];
  const RemainingJob = requireDataList.filter(item => !(item in actionData));
  try {
    if (!event) {
      return handler[RemainingJob[0]].message(action); // first time init return first remaining job message
    } else if (RemainingJob.length > 1) {
      const result = await handler[RemainingJob[0]].func(event, action, user);
      if(result) {
        action.data = { ...actionData, ...result };
        action.save();
        const nextMsg = await handler[RemainingJob[1]].message(action);
        return replyMessage(event.replyToken, [...nextMsg]);
      }
      // else {
      //   const msg = await handler[RemainingJob[0]].message(action);
      //   return replyMessage(event.replyToken, [{ type: 'text', text: 'ข้อมูลไม่ถูกต้องโปรดลองใหม่!!!' }, ...msg]);
      // }
    } else {
      const result = await handler[RemainingJob[0]].func(event, action, user);
      if(result) {
        action.data = { ...actionData, ...result };
        action.success = true;
        action.save();
        // await models.book.findOne({
        //   where: {
        //     id: action.data.book_id,
        //   }
        // });
        const transaction = await models.sequelize.transaction();
        await models.book.update({ count: literal('count - 1') }, { where: { id: action.data.book_id }, transaction });
        await models.transaction.create({ ...action.data, action: 'borrow', return: false }, { transaction });
        await transaction.commit();
        return replyMessage(event.replyToken, [{ type: 'text', text: 'ยืมหนังสือสำเร็จแล้ว' }]);
      }
      // else {
      //   const msg = handler[RemainingJob[0]].message();
      //   return replyMessage(event.replyToken, [{ type: 'text', text: 'ข้อมูลไม่ถูกต้องโปรดลองใหม่!!!' }, ...msg]);
      // }
    }
  } catch (error) {
    const msg = await handler[RemainingJob[0]].message(action);
    return replyMessage(event.replyToken, [{ type: 'text', text: error.message }, ...msg]);
  }
};

module.exports = async (event, action, user, query) => {
  try {
    if (action) {
      init(action, event, user);
    } else {
      const newAction = await models.action.create({
        job: 'borrow',
        success: false,
        step: 0,
        line_user_id: user.id,
        data: query,
      });
      const initMessage = await init(newAction, null); // first remaining job message
      return replyMessage(event.replyToken, [{ type: 'text', text: 'มายืมหนังสือกันเลย!!!' }, ...initMessage]);
    }
  } catch (e) {
    return replyMessage(event.replyToken, [{ type: 'text', text: 'บางอย่างเกิดผิดพลาด' }]);
  }
}