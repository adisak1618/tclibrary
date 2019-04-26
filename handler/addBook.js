const { client, replyMessage } = require('../helper');
const { uploadFromUrl } = require('../helper/upload');
const { BookTemplate } = require('./messageTemplate');
const models = require('./../models');
const { Op } = require('sequelize');
const categoryLiffAppMsg = [{
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
          "text": "หมวดหมู่ของหนังสือ",
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
          "text": "กรุณา เลือกหมวดหมู่ที่เหมาะสมให้กับหนังสือเล่มนี้",
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
            "type": "uri",
            "label": "กดเพื่อเลือก",
            "uri": "line://app/1568430904-8Wmd7qbb"
          },
          "style": "primary"
        }
      ]
    }
  }
}];
const coverMsg = [{
  type: 'text',
  text: 'รูปหน้าปก? (อัพโหลดรูปรอนิดนึงเนาะ)',
  quickReply: {
    "items": [
      {
        "type": "action",
        "action": {
          "type": "camera",
          "label": "ถ่ายรูป",
        }
      },
      {
        "type": "action",
        "action": {
          "type": "cameraRoll",
          "label": "เลือกจากคลังภาพ",
        }
      },
      {
        "type": "action",
        "action": {
          "type":"postback",
          "label":"ข้าม",
          "data":"cancle",
          "displayText":"ยังไม่เพิ่ม"
        }
      }
    ]
  }
}];

const handler = {
  name: {
    message: () => [{ type: 'text', text: 'ชื่อหนังสือคือ?' }],
    func: (event, action) => {
      if(event.type === 'message' && event.message.type === 'text') {
        return { name: event.message.text.trim() }
      }
    }
  },
  writer_id: {
    message: () => [{ type: 'text', text: 'ชื่อผู้เขียนคือ?' }],
    func: async (event, action) => {
      if(event.type === 'message' && event.message.type === 'text') {
        const msg = event.message.text.trim();
        const [writer, created] = await models.writer.findOrCreate({
          where: {
            name: msg,
          },
          defaults: {
            name: msg,
          }
        });
        return { writer_id: writer.id }
      }
    }
  },
  category: {
    message: () => categoryLiffAppMsg,
    func: () => ({ category: true })
  },
  page_count: {
    message: () => [{ type: 'text', text: 'จำนวนหน้า?' }],
    func: (event, action) => {
      console.log('page_count');
      if(event.type === 'message' && event.message.type === 'text' && !isNaN(event.message.text.trim())) {
        return { page_count: event.message.text.trim() }
      }
    }
  },
  publisher: {
    message: () => [{ type: 'text', text: 'สำนักพิมพ์?' }],
    func: (event, action) => {
      if(event.type === 'message' && event.message.type === 'text') {
        return { publisher: event.message.text.trim() }
      }
    }
  },
  price: {
    message: () => [{ type: 'text', text: 'ราคา?' }],
    func: (event, action) => {
      if(event.type === 'message' && event.message.type === 'text' && !isNaN(event.message.text.trim())) {
        return { price: event.message.text.trim() }
      }
    }
  },
  isbn_code: {
    message: () => [{ type: 'text', text: 'isbn?' }],
    func: (event, action) => {
      if(event.type === 'message' && event.message.type === 'text' && !isNaN(event.message.text.trim())) {
        return { isbn_code: event.message.text.trim() }
      }
    }
  },
  count: {
    message: () => [{
      type: 'text',
      text: 'เพิ่มกี่เล่ม?',
      quickReply: {
        "items": [
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "1",
              "text": "1",
            }
          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "2",
              "text": "2",
            }
          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "3",
              "text": "3",
            }
          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "4",
              "text": "4",
            }
          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "5",
              "text": "5",
            }
          }
        ]
      }
    }],
    func: (event, action) => {
      if(event.type === 'message' && !isNaN(event.message.text.trim())) {
        return { count: event.message.text.trim() };
      }
    }
  },
  cover: {
    message: () => coverMsg,
    func: async (event, action) => {
      if(event.type === 'message' && event.message.type === 'image' && event.message.contentProvider.type === 'line') {
        const name = action.data.name || 'unknow';
        const { key } = await uploadFromUrl(`https://api.line.me/v2/bot/message/${event.message.id}/content`, `${name}-${(new Date()).getTime()}`, { Authorization: `Bearer ${process.env.channelAccessToken}` });
        return { cover: key };
      } else if (event.type === 'postback' && event.postback.data === 'cancle') {
        return { cover: null };
      }
    }
  }
};

const init = async (action = { data: null }, event) => {
  try {
    const requireDataList = ['name', 'writer_id', 'category', 'page_count', 'publisher', 'price', 'isbn_code', 'count', 'cover'];
    const actionData = action.data || {};
    const RemainingJob = requireDataList.filter(item => !(item in actionData));
    if (!event) {
      return handler[RemainingJob[0]].message(); // first time init return first remaining job message
    } else if (RemainingJob.length > 1) {
      if(handler[RemainingJob[0]].func) {
        const result = await handler[RemainingJob[0]].func(event, action);
        if(result) {
          action.data = { ...actionData, ...result };
          action.save();
        } else {
          const msg = handler[RemainingJob[0]].message();
          return replyMessage(event.replyToken, [{ type: 'text', text: 'ข้อมูลไม่ถูกต้องโปรดลองใหม่!!!' }, ...msg]);
        }
      }
      const nextMsg = handler[RemainingJob[1]].message();
      return replyMessage(event.replyToken, [...nextMsg]);
    } else {
      const result = await handler[RemainingJob[0]].func(event, action);
      if(result) {
        action.data = { ...actionData, ...result };
        action.success = true;
        action.save();
        const newBook = await models.book.create(action.data);
        const book = await models.book.findOne({
          where: {
            id: newBook.id
          },
          include: [
            {
              model: models.category,
              as: 'category',
            },
            {
              model: models.writer,
              as: 'writer',
            }
          ],
        });
        const { cover, name, category, writer, page_count, publisher, count, id } = book;
        const newBookMsg = BookTemplate({
          cover: `https://s3-ap-southeast-1.amazonaws.com/tcliberry/${cover}`,
          name,
          category: category.name,
          writer: writer.name,
          page_count,
          publisher,
          count,
          bookid: id,
        })
        return replyMessage(event.replyToken, [{ type: 'text', text: 'ดีใจด้วย หนังสือเล่มนี้พร้อมที่จะให้ยืมแล้ว!!!' }, newBookMsg]);
      } else {
        const msg = handler[RemainingJob[0]].message();
        return replyMessage(event.replyToken, [{ type: 'text', text: 'ข้อมูลไม่ถูกต้องโปรดลองใหม่!!!' }, ...msg]);
      }
    }
  } catch (error) {
    return replyMessage(event.replyToken, [{ type: 'text', text: 'บางอย่างเกิดผิดพลาด' }]);
  }
};

module.exports = async (event, action, user, query) => {
  try {
    if (action) {
      init(action, event);
    } else {
      const newAction = await models.action.create({
        job: 'addBook',
        success: false,
        step: 0,
        line_user_id: user.id,
        data: query,
      });
      const initMessage = await init(newAction, null); // first remaining job message
      return replyMessage(event.replyToken, [{ type: 'text', text: 'เริ่มลงทะเบียนหนังสือกันเลย!!!' }, ...initMessage]);
    }
  } catch (e) {
    return replyMessage(event.replyToken, [{ type: 'text', text: 'บางอย่างเกิดผิดพลาด' }]);
  }
}