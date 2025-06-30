const express = require('express');
const app = express();
app.use(express.json());

app.post('/messages', (req, res) => {
  res.json({
    status: 'success',
    data: {
      message_id: 'msg_001',
      recipient: req.body.recipient,
      status: 'delivered'
    }
  });
});

app.listen(4003, () => console.log('Mock Communication Service running on port 4003'));