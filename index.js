import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { join } from 'path';
import rfs from 'rotating-file-stream';
import mongoose from 'mongoose';
import logger from './src/logger/logger';
import dbConfig from './src/configs/db.config';

mongoose.Promise = global.Promise;

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(json());

// enabling CORS for all requests
app.use(cors());

// create a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: join(__dirname, 'log'),
});

// adding morgan to log HTTP requests
app.use(morgan('combined', { stream: accessLogStream }));

// Connecting to the database
mongoose
  .connect(dbConfig.connectionString, {
    useNewUrlParser: true,
  })
  .then(() => {
    logger.info('Successfully connected to the database');
  })
  .catch((err) => {
    logger.info(`Could not connect to the database. Exiting now...\n${err}`);
    process.exit();
  });

app.get('/', (req, res) => {
  logger.info('GET /');
  res.send('App works!!!!!');
});

app.use('/api', require('./src/routes/routes').default);

// request to handle undefined or all other routes
app.get('*', (req, res) => {
  logger.info('GET undefined routes');
  res.send('App works!!!!!');
});

// starting the server
app.listen(3001, () => {
  logger.info('listening on port 3001');
});

// Export our app for testing purposes
export default app;
