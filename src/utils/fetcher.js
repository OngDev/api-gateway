import axios from 'axios';
import logger from '../logger/logger';

const Fetcher = {};

function isSuccessfulResponseStatus(status) {
  return status >= 200 && status < 300;
}

Fetcher.get = async (route) => {
  logger.info(`Calling GET to ${route}`);
  let res;
  try {
    res = await axios.get(route);
  } catch (error) {
    res = error.response;
  }
};

Fetcher.post = async (route, requestData) => {
  logger.info(`Calling REST to ${route}`);
  let res;
  try {
    res = await axios.post(route, requestData);
  } catch (error) {
    res = error.response;
  }

  const { status, data } = res;
  const result = {};
  result.status = status;
  if (isSuccessfulResponseStatus(status)) {
    result.data = data;
  } else {
    result.error = {
      message: data,
    };
  }
  return result;
};

Fetcher.put = () => {

};

Fetcher.delete = () => {

};

export default Fetcher;
