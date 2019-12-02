import mongoose from 'mongoose';
import logger from '../logger/logger';

/* istanbul ignore next */
const connectDatabase = () => {
  mongoose.Promise = global.Promise;
  // Connecting to the database
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
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
