require('dotenv').config();
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

// eslint-disable-next-line import/no-unresolved
const csml = require('../native');
const mod = require('../package.json');

const app = express();

app.use(morgan('tiny'));
app.disable('x-powered-by');
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/**
 * Default route
 */
app.get('/', (req, res) => res.send(`Running CSML Server v${mod.version}`));

/**
 * Receive and handle incoming events
 */
app.post('/run', (req, res) => {
  const { bot, event } = req.body;
  if (event.payload && event.payload.content && event.payload.content.close_flows === true) {
    csml.closeAllConversations(event.client);
  }
  const data = csml.run(event, bot);
  return res.json(data);
});

/**
 * Validate if a bot is valid CSML
 */
app.post('/bots/validate', (req, res) => {
  try {
    const data = csml.validateBot(req.body);
    return res.json(data);
  }
  catch (err) {
    return res.json({ valid: false, message: err });
  }
});

/**
 * Retrieve all the steps present in each flow of a given bot
 */
app.post('/get_bot_steps', (req, res) => {
  const data = csml.getBotSteps(req.body);
  return res.json(data);
});

/**
 * Find out if the given client has an open conversation
 */
app.post('/conversations/open', (req, res) => {
  const data = csml.getOpenConversation(req.body);
  return res.json(data);
});

/**
 * Close all open conversations of a given client
 */
app.post('/conversations/close', (req, res) => {
  const success = csml.closeAllConversations(req.body);
  return res.json({ success });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('CSML Engine Error:', err);
  if (res.headersSent) return;
  return res.status(err.status || err.statusCode || 500).send(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
