import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import logger from '../logger/logger';

/* istanbul ignore next */
const auth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const data = jwt.verify(token, process.env.JWT_KEY);
  logger.info(`Verified token: ${token}`);
  try {
    // eslint-disable-next-line no-underscore-dangle
    const user = await UserModel.findOne({ _id: data._id, 'tokens.token': token });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Not authorized to access this resource' });
  }
};

export default auth;
