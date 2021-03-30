const { static } = require('express');
const express = require('express');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../env/dev.env')});

const app = express();

const port = process.env.PORT;

const publicPath = path.resolve(__dirname, '../public');

app.use(express.static(publicPath));

app.listen(port, () => console.log(`Running on ${port}`));