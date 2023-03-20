var express = require("express");
var router = express.Router();
var axios = require ('axios');

router.get("/", (req, res) => {
  res.send("<h1>Server</h1>")
})

router.post("/", function (req, res, next) {
  const tokens = req.body.text.split(" ");
  if (tokens.length > 2020) {
    return res.status(400).json({
      error: {
        message:
          "The selected text exceeds the maximum limit of 2000 words. Please select a shorter text and try again.",
      },
    });
  }
  axios({
    url: "https://api.openai.com/v1/chat/completions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
    data: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `${req.body.text}` }],
    }),
  })
    .then((response) => response.data)
    .then((data) => {
      console.log(data);

      if (data.error) {
        return res.status(400).json(data);
      }
      res.json({ summary: data.choices[0].message.content });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
});

module.exports = router;
