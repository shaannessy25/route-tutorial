const uuidv4 = require('uuid/v4');
const express = require('express');
const models = require('./models');
const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.context = {
      models,
      me: models.users[1],
    };
    next();
  });
  

  

app.get('/users', (req, res) => {
    return res.send(Object.values(req.context.models.users));
});
app.get('/users/:userId', (req, res) => {
    return res.send(req.context.models.users[req.params.userId]);
});

app.get('/messages', (req, res) => {
    return res.send(Object.values(req.context.models.messages));
});

app.get('/messages/:messageId', (req, res) => {
    return res.send(req.context.models.messages[req.params.messageId]);
});

app.get('/session', (req, res) => {
    return res.send(req.context.models.users[req.context.me.id]);

  });
app.post('/users', (req, res) => {
    return res.send('POST HTTP method on user resource');
});
app.post('/messages', (req, res) => {
    const id = uuidv4();
    const message = {
      id,
      text: req.body.text,
      userId: req.context.me.id,
    };
    req.context.models.messages[id] = message;
    return res.send(message);
});

app.put('/users/:userId', (req, res) => {
    return res.send(`PUT HTTP method on user/${req.params.userId} resource`);
  });

app.delete('/users/:userId', (req, res) => {
    return res.send(`DELETE HTTP method on user/${req.params.userId} resource`);
});

app.delete('/messages/:messageId', (req, res) => {
    const {
      [req.params.messageId]: message,
      ...otherMessages
    } = req.context.models.messages;
    req.context.models.messages = otherMessages;
    return res.send(message);
  });
app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);