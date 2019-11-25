import mongoose from 'mongoose';

import logger from '../../logger/logger';

const prepareTestDatabase = () => {
  mongoose.Promise = global.Promise;
  // Connecting to the database
  before((done) => {
    mongoose
      .connect('mongodb://127.0.0.1:27017/ongdev-local', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
    mongoose.connection.once('open', () => {
      done();
    }).on('error', (error) => {
      logger.error(error);
    });
  });
};

export default prepareTestDatabase;
