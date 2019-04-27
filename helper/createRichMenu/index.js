const fs = require('fs');
const path = require('path');
const { client } = require('./../index');

exports.createRichMenu = async () => {
  const newMenuID = await client.createRichMenu({
    "size": { "width": 1200, "height": 810 },
    "selected": true,
    "name": "user_menu",
    "chatBarText": "เมนูสมาชิก",
    "areas": [
      {
        "bounds": {
          "x": 0,
          "y": 0,
          "width": 800,
          "height": 810
        },
        "action": {
          "type": "postback",
          "label": "ค้นหาหนังสือ",
          "displayText": "ค้นหาหนังสือ",
          "data": "searchBook"
        }
      },
      {
        "bounds": {
          "x": 800,
          "y": 0,
          "width": 400,
          "height": 405
        },
        "action": {
          "type": "postback",
          "label": "ยืมหนังสือ",
          "displayText": "ยืมหนังสือ",
          "data": "borrowBook"
        }
      },
      {
        "bounds": {
          "x": 800,
          "y": 405,
          "width": 400,
          "height": 405
        },
        "action": {
          "type": "postback",
          "label": "คืนหนังสือ",
          "displayText": "คืนหนังสือ",
          "data": "returnBook"
        }
      }
    ]
  });
  const file = await client.setRichMenuImage(newMenuID, fs.createReadStream(path.resolve(__dirname, 'adminmenu.jpg')));
  console.log('newMenuID222', newMenuID)
  // const setMenu = await client.setDefaultRichMenu(newMenuID);
  // const data = await client.deleteDefaultRichMenu();
  // try {
    // const data = await client.deleteDefaultRichMenu();
  //   console.log('getRichMenuList', data);
  // } catch (error) {
  //   console.log('getRichMenuList Error', error);
  // }
}

exports.createUserRichMenu = async () => {
  const newMenuID = await client.createRichMenu({
    "size": { "width": 1200, "height": 810 },
    "selected": true,
    "name": "user_menu",
    "chatBarText": "เมนูสมาชิก",
    "areas": [
      {
        "bounds": {
          "x": 0,
          "y": 0,
          "width": 800,
          "height": 810
        },
        "action": {
          "type": "uri",
          "label": "เกี่ยวกับเรา",
          "uri": "https://linecorp.com/"
        }
      },
      {
        "bounds": {
          "x": 800,
          "y": 0,
          "width": 400,
          "height": 405
        },
        "action": {
          "type": "postback",
          "label": "บัตรสะสมแต้ม",
          "displayText": "บัตรสะสมแต้มของฉัน",
          "data": "myPoint"
        }
      },
      {
        "bounds": {
          "x": 800,
          "y": 405,
          "width": 400,
          "height": 405
        },
        "action": {
          "type": "postback",
          "label": "ข้อมูลส่วนตัว",
          "displayText": "ข้อมูลส่วนตัว",
          "data": "myProfile"
        }
      }
    ]
  });
  const file = await client.setRichMenuImage(newMenuID, fs.createReadStream(path.resolve(__dirname, 'usermenu.jpg')));
  // const setMenu = await client.setDefaultRichMenu(newMenuID);
  // const data = await client.deleteDefaultRichMenu();
  // try {
    // const data = await client.deleteDefaultRichMenu();
  //   console.log('getRichMenuList', data);
  // } catch (error) {
  //   console.log('getRichMenuList Error', error);
  // }
}

exports.createShopRichMenu = async () => {
  const newMenuID = await client.createRichMenu({
    "size": { "width": 1200, "height": 810 },
    "selected": true,
    "name": "user_menu",
    "chatBarText": "เมนูสมาชิก",
    "areas": [
      {
        "bounds": {
          "x": 0,
          "y": 0,
          "width": 800,
          "height": 405
        },
        "action": {
          "type": "message",
          "text": "เมนูร้านค้า",
        }
      },
      {
        "bounds": {
          "x": 800,
          "y": 0,
          "width": 400,
          "height": 405
        },
        "action": {
          "type": "postback",
          "label": "บัตรสะสมแต้ม",
          "displayText": "บัตรสะสมแต้มของฉัน",
          "data": "myPoint"
        }
      },
      {
        "bounds": {
          "x": 0,
          "y": 405,
          "width": 400,
          "height": 405
        },
        "action": {
          "type": "postback",
          "label": "เพิ่มคะแนน",
          "displayText": "เพิ่มคะแนน",
          "data": "addPoint"
        }
      },
      {
        "bounds": {
          "x": 400,
          "y": 405,
          "width": 400,
          "height": 405
        },
        "action": {
          "type": "postback",
          "label": "แลกของรางวัล",
          "displayText": "แลกของรางวัล",
          "data": "redeemReward"
        }
      },
      {
        "bounds": {
          "x": 800,
          "y": 405,
          "width": 400,
          "height": 405
        },
        "action": {
          "type": "postback",
          "label": "ข้อมูลส่วนตัว",
          "displayText": "ข้อมูลส่วนตัว",
          "data": "myProfile"
        }
      }
    ]
  });
  const file = await client.setRichMenuImage(newMenuID, fs.createReadStream(path.resolve(__dirname, 'shopmenu.jpg')));
  // const setMenu = await client.setDefaultRichMenu(newMenuID);
  // const data = await client.deleteDefaultRichMenu();
  // try {
    // const data = await client.deleteDefaultRichMenu();
  //   console.log('getRichMenuList', data);
  // } catch (error) {
  //   console.log('getRichMenuList Error', error);
  // }
}
