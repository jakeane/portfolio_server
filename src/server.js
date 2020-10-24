import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import apiRouter from './router';
// import { getAllData } from './data_controller';
import getData from './collector';
import saveData from './data_controller';

dotenv.config({ silent: true });

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/portfolio_db';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

const cron = require('node-cron');

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// additional init stuff should go before hitting the routing

// default index route
app.get('/', (req, res) => {
  res.send('hi');
});

// api for frontend
app.use('/api', apiRouter);

// default index route
app.get('/', (req, res) => {
  res.send('hi');
});

// scheduled task
let i = 0;
cron.schedule('*/10 * * * * *', () => {
  console.log('Running process...', i);
  i += 1;
  if ('...'.length === 10) {
    getData().then((database) => {
      saveData(database);
    });
  }
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
