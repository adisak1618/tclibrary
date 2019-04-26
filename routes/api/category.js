var express = require('express');
var router = express.Router();
const models = require('./../../models');
const { response, validateBody } = require('./../../helper');
const { body } = require('express-validator/check');

/* list all categories. */
const checkChooseBody = [
  body('line_user_id').not().isEmpty(),
  body('category_id').not().isEmpty(),
];
router.post('/choose', checkChooseBody, validateBody, async (req, res, next) => {
  try {

    const lineuser = await models.line_user.findOne({
      where: {
        lineid: req.body.line_user_id,
      },
      include: [
        {
          model: models.action,
          as: 'jobs',
          where: {
            success: false,
          }
        }
      ]
    });
    const action =lineuser.jobs[0];
    const actionData = action.data || {};
    action.data = { ...actionData, category_id: Number(req.body.category_id) }
    action.save();
    response(res, action.data);
  } catch (error) {
    console.log(error);
    response(res, null, 'cantnotupdatecategorychooses', 'can not update');
  }
});

module.exports = router;
