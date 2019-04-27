const { client, replyMessage } = require('../helper');
const models = require('./../models');
const { Op } = require('sequelize');
const { BooksTemplate } = require('./messageTemplate');
module.exports = async (event, action, user) => {
  try {
    if (action) {
      if (event.type === 'message') {
        const replyText = event.message.text.trim();
        const books = await models.book.findAll({
          where: {
            [Op.or]: [
              {
                name: {
                  [Op.like]: `%${replyText}%`
                }
              },
              {
                isbn_code: replyText,
              }
            ]
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
          limit: 9,
        });
        action.success = true;
        if (books.length === 0) {
          action.data = {
            text: replyText,
            found: false,
          }
          action.save();
          return replyMessage(
            event.replyToken,
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
                      "text": "ไม่มีข้อมูล!",
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
                        "data": isNaN(replyText) ? "addBook" : `addBook?isbn_code=${replyText}`,
                      },
                      "style": "primary"
                    }
                  ]
                }
              }
            }
          );
        } else {
          // const { cover, name, category, writer, page_count, publisher, count, id } = book;
          // const newBookMsg = BookTemplate({
          //   cover: `https://s3-ap-southeast-1.amazonaws.com/tcliberry/${cover}`,
          //   name,
          //   category: category.name,
          //   writer: writer.name,
          //   page_count,
          //   publisher,
          //   count,
          //   bookid: id,
          // })
          const booksCard = books.map(({ cover, name, category, writer, page_count, publisher, count, id }) => BooksTemplate({
            cover: `https://s3-ap-southeast-1.amazonaws.com/tcliberry/${cover}`,
            name,
            category: category.name,
            writer: writer.name,
            page_count,
            publisher,
            count,
            bookid: id,
          }));
          action.data = {
            text: replyText,
            found: true,
          }
          action.save();
          const msg = {
            "type": "flex",
            "altText": "Flex Message",
            "contents": {
              "type": "carousel",
              "contents": booksCard
            }
          }
          return replyMessage(event.replyToken, msg);
        }
      } else {
        return replyMessage(event.replyToken, { type: 'text', text: 'ลองใหม่อีกรอบนะ โปรดระบุชื่อหนังสือ หรือ ISBN code เป็นตัวหนังสือ!' });
      }
    } else {
      const newAction = await models.action.create({
        job: 'searchBook',
        success: false,
        step: 0,
        line_user_id: user.id,
      });
      return replyMessage(event.replyToken, { type: 'text', text: 'โปรดระบุชื่อหนังสือ หรือ ISBN code' });
    }
  } catch (e) {
    console.log(e);
  }
}