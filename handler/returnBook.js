const { client, replyMessage } = require('../helper');
const { returnBookConfirm } = require('./messageTemplate');
const models = require('../models');
const { Op, literal } = require('sequelize');

const handler = {
  user_id: {
    message: () => [{ type: 'text', text: 'รหัสนักเรียนที่จะคืนหนังสือ?' }],
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
        return replyMessage(event.replyToken, [{ type: 'text', text: 'ไม่พบนักเรียนคนนี้ โปรดลองใหม่'}]);
      }
    }
  },
  book_id: {
    message: () => [{ type: 'text', text: 'isbn ของหนังสือที่จะคืน?' }],
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
          { type: 'text', text: 'ไม่พบหนังสือเล่มนี้ โปรดลองใหม่'}
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
      const msg = returnBookConfirm({ cover: `https://s3-ap-southeast-1.amazonaws.com/tcliberry/${cover}`, fullname, user_code, bookname });
      return [msg];
    },
    func: async (event, action) => {
      if(event.type === 'postback' && event.postback.data === 'yes') {
        const BookTransaction = await models.transaction.findOne({
          where: {
            book_id: action.data.book_id,
            user_id: action.data.user_id,
            return: false,
          }
        });
        if(BookTransaction) {
          return { validate: true };
        } else {
          action.success = true;
          await action.save();
          replyMessage(event.replyToken, [
            { type: 'text', text: 'ไม่พบการยืมหนังสือเล่มนี้จากนักเรียนคนดังกล่าว'}
          ]);
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
    } else {
      const result = await handler[RemainingJob[0]].func(event, action, user);
      if(result) {
        action.data = { ...actionData, ...result };
        action.success = true;
        action.save();
        const transaction = await models.sequelize.transaction();
        await models.transaction.update({ return: true }, { where: { book_id: action.data.book_id, user_id: action.data.user_id, }, transaction });
        await models.book.update({ count: literal('count + 1') }, { where: { id: action.data.book_id }, transaction });
        await transaction.commit();
        return replyMessage(event.replyToken, [{ type: 'text', text: 'คืนหนังสือสำเร็จแล้ว' }]);
      }
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
        job: 'returnBook',
        success: false,
        step: 0,
        line_user_id: user.id,
        data: query,
      });
      const initMessage = await init(newAction, null); // first remaining job message
      return replyMessage(event.replyToken, [{ type: 'text', text: 'เริ่มคืนหนังสือ!!!' }, ...initMessage]);
    }
  } catch (e) {
    return replyMessage(event.replyToken, [{ type: 'text', text: 'บางอย่างเกิดผิดพลาด' }]);
  }
}