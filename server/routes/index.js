var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  console.log(req.body.text);
  console.log(req.body.text.split(' ').length);
  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.TOKEN}`
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": `${req.body.text}`}]
    }),
})
    .then((response) => response.json())
    .then((data) => {
      if(data.error) {
        return res.status(400).json(data.error)
      }
      res.json({summary: data.choices[0].message.content})
    })
});

module.exports = router;
