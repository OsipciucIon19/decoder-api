/**
 * Starts the application on the port specified.
 */
require('dotenv').config();
const express = require('express');
const route = require('./router/index');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use('/api', route);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});