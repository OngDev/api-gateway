import { LOGIN_ROUTE, REGISTER_ROUTE } from '../constant/route.constant';
import { BAD_REQUEST, INTERNAL_ERROR, OK } from '../constant/response.constant';
import { getErrorResponse, getMessageResponse, getSuccessResponse } from '../helpers/ResponseHelper';
import Fetcher from '../utils/fetcher';
import logger from '../logger/logger';

const AuthController = {};

AuthController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const {
      status,
      data,
      message,
    } = await Fetcher.post(LOGIN_ROUTE, { email, password });
    return getSuccessResponse(res, status, { data, message });
  } catch (error) {
    return getErrorResponse(res, BAD_REQUEST, error.message);
  }
};

AuthController.register = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    const fetchResult = await Fetcher.post(REGISTER_ROUTE, { email, fullName, password });
    if (!fetchResult.error) {
      return getSuccessResponse(res, fetchResult.status, fetchResult.data);
    }
    return getErrorResponse(res, fetchResult.status, fetchResult.error.message);
  } catch (error) {
    return getErrorResponse(res, INTERNAL_ERROR, error.message);
  }
};

// AuthController.getCurrent = async (req, res) => res
//   .status(200)
//   .json({ status: 200, data: { email: req.user.email, fullName: req.user.fullName } });

// AuthController.logout = async (req, res) => {
//   try {
//     AuthService.logout({
//       user: req.user,
//       foundToken: req.token,
//     });
//     res.send();
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// AuthController.logoutAll = async (req, res) => {
//   try {
//     AuthService.logoutAll({
//       user: req.user,
//     });
//     res.send();
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

export default AuthController;
