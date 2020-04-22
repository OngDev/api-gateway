import mongoose from 'mongoose';
import logger from '../logger/logger';

/* istanbul ignore next */
const connectDatabase = () => {
  const {
    MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB,
  } = process.env;
  const mongoDbUrl = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
  logger.info(`Connecting to ${mongoDbUrl}`);
  mongoose.Promise = global.Promise;
  // Connecting to the database
  mongoose
    .connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      logger.info('Successfully connected to the database');
    })
    .catch((err) => {
      logger.info(`Could not connect to the database. Exiting now...\n${err}`);
      process.exit();
    });
};

export default connectDatabase;
