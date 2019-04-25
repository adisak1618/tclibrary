const { client, replyMessage } = require('../helper');
const models = require('./../models');
const { Op } = require('sequelize');

const init = (event, action) => {
  const requireDataList = ['name', 'writer_id', 'category_id', 'page_count', 'publisher', 'price', 'isbn_code'];
  const DoneJob = action.data || {};
  const RemainingJob = requireDataList.filter(item => !(item in Object.keys(DoneJob)));
  if (RemainingJob.length > 0) {
    RemainingJob[0];
    const data = action.data || {};
    action.data = { ...data, name: event.message.text };
    action.save();
    console.log('RemainingJob', RemainingJob[0]);
  } else {
    console.log('RemainingJob', RemainingJob);
  }
};

const handler = {
  name: {
    label: () => [{ type: 'text', text: 'ชื่อหนังสือคือ?' }],
    handler: (event, action) => {
      if(event.type === 'message') {
        return { name: event.message.text.trim() }
      } else {
        return [{ type: 'text', text: 'ข้อมูลไม่ถูกต้องโปรดลองใหม่!!!' }];
      }
    }
  },
  writer_id: {
    label: () => [{ type: 'text', text: 'ชื่อผู้เขียนคือ?' }],
    handler: async (event, action) => {
      if(event.type === 'message') {
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
      } else {
        return [{ type: 'text', text: 'ข้อมูลไม่ถูกต้องโปรดลองใหม่!!!' }];
      }
    }
  },
  category_id: {
    label: async () => {
      const categories = await models.category.findAll();
    },
    handler: async (event, action) => {
      if(event.type === 'message' && !isNaN(event.message.text.trim())) {
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
      } else {
        return [{ type: 'text', text: 'ข้อมูลไม่ถูกต้องโปรดลองใหม่!!!' }];
      }
    }
  },
};

module.exports = async (event, action, user, query) => {
  try {
    if (action) {
      init(event, action);
    } else {
      const newAction = await models.action.create({
        job: 'addBook',
        success: false,
        step: 0,
        line_user_id: user.id,
        data: query,
      });
      return replyMessage(event.replyToken, [{ type: 'text', text: 'เริ่มลงทะเบียนหนังสือกันเลย!!!' }]);
    }
  } catch (e) {
    console.log(e);
  }
}