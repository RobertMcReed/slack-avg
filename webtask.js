const Webtask = require('webtask-tools');
const express = require('express');
const { urlencoded } = express;
const app = express();

app.post('/', urlencoded({ extended: true }), (req, res) => {
  if (req.body.token !== req.webtaskContext.secrets.SLACK_TOKEN) return res.sendStatus(401);

  let message = 'Please provide a space-separated list of numbers.';

  if (req.body.text.trim().toLowerCase() === 'help') return res.send(message);
  
  const nums = req.body.text
    .replace(/,/g, '')
    .match(/-?(\d|\.)+/g) || []
    .filter(a => 
      (/^\d+(\.?\d+)?$/).test(a)
    );

  const numNums = nums.length;

  if (numNums) {
    const sum = nums.reduce((a, v) => a + parseFloat(v), 0);
    let avg = sum / numNums;

    const formattedNums = nums.map(num => num.toLocaleString());

    message = `Your numbers: ${formattedNums.join(', ')}`;
    avg = `Average: ${avg.toLocaleString()}`;

    const payload = {
      text: message,
      attachments: [
        {
          text: avg
        }
      ]
    };

    res.json(payload);
  } else res.send(`Error: ${message}`);
});

module.exports = Webtask.fromExpress(app);

