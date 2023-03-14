var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  req.body
  console.log(req.body);
  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.TOKEN}`
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": `simplify this: ${req.body.text}`}]
    }),
})
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      res.json({summary: data.choices[0].message.content})
    })
    .catch((err)=>{
      console.log(err);
      res.status(401).json(err);
    });
});

module.exports = router;
