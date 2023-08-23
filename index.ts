/**
 * Starts the application on the port specified.
 */
require('dotenv').config();
const express = require('express');
const route = require('./src/router');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(route);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
