module.exports = ({ cover, name, category, writer, page_count, publisher, count, bookid }) => {
  return {
    "type": "flex",
    "altText": "Flex Message",
    "contents": {
      "type": "bubble",
      "hero": {
        "type": "image",
        "url": cover,
        "size": "full",
        "aspectRatio": "3:4",
        "aspectMode": "cover",
        "action": {
          "type": "uri",
          "label": "Line",
          "uri": "https://linecorp.com/"
        }
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": name,
            "size": "xl",
            "align": "center",
            "weight": "bold",
            "wrap": true
          },
          {
            "type": "text",
            "text": `หมวด: ${category}`,
            "margin": "sm",
            "size": "md",
            "align": "center",
            "weight": "bold",
            "wrap": true
          },
          {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "margin": "lg",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "ผู้เขียน",
                    "flex": 1,
                    "size": "sm",
                    "color": "#AAAAAA"
                  },
                  {
                    "type": "text",
                    "text": writer,
                    "flex": 5,
                    "size": "sm",
                    "color": "#666666",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "สำนักพิมพ์",
                    "flex": 2,
                    "size": "sm",
                    "color": "#AAAAAA"
                  },
                  {
                    "type": "text",
                    "text": publisher,
                    "flex": 5,
                    "size": "sm",
                    "color": "#666666",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "คงเหลือ",
                        "size": "sm",
                        "color": "#AAAAAA"
                      },
                      {
                        "type": "text",
                        "text": `${count} เล่ม`,
                        "size": "sm",
                        "color": "#666666",
                        "wrap": true
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "จำนวนหน้า",
                        "flex": 3,
                        "size": "sm",
                        "align": "start",
                        "color": "#AAAAAA"
                      },
                      {
                        "type": "text",
                        "text": `${page_count}`,
                        "flex": 2,
                        "size": "sm",
                        "color": "#666666",
                        "wrap": true
                      }
                    ]
                  }
                ]
              }
            ]
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
              "label": "คืน",
              "data": `return=?id=${bookid}`,
              "displayText": `เริ่มยืมหนังสือ ${name}`
            },
            "height": "sm",
            "style": "secondary"
          },
          {
            "type": "button",
            "action": {
              "type": "postback",
              "label": "ยืม",
              "data": `borrow=?id=${bookid}`,
              "displayText": `เริ่มคืนหนังสือ ${name}`
            },
            "height": "sm",
            "style": "primary"
          }
        ]
      }
    }
  }
}