module.exports = ({ cover, fullname, user_code, bookname }) => {
  return {
    "type": "flex",
    "altText": "Flex Message",
    "contents": {
      "type": "bubble",
      "hero": {
        "type": "image",
        "url": cover,
        "size": "full",
        "aspectRatio": "1:1",
        "aspectMode": "cover",
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": fullname,
            "size": "xl",
            "align": "center",
            "weight": "bold",
            "wrap": true
          },
          {
            "type": "text",
            "text": `รหัสนักเรียน: ${user_code}`,
            "margin": "sm",
            "size": "md",
            "align": "center",
            "wrap": true
          },
          {
            "type": "separator",
            "margin": "xl"
          },
          {
            "type": "text",
            "text": "หนังสือที่ยืม",
            "margin": "xl",
            "size": "md",
            "align": "center"
          },
          {
            "type": "text",
            "text": bookname,
            "size": "xl",
            "align": "center",
            "weight": "bold"
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "horizontal",
        "flex": 0,
        "spacing": "sm",
        "contents": [
          {
            "type": "button",
            "action": {
              "type": "postback",
              "label": "ยกเลิก",
              "displayText": "ยกเลิก",
              "data": "ยกเลิก"
            },
            "height": "sm",
            "style": "secondary"
          },
          {
            "type": "button",
            "action": {
              "type": "postback",
              "label": "ตกลง",
              "displayText": "ตกลง",
              "data": "yes"
            },
            "height": "sm",
            "style": "primary"
          }
        ]
      }
    }
  };
}