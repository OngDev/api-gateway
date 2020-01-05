import AuthService from '../services/auth.service';

const AuthController = {};

AuthController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await AuthService.login({
      email,
      password,
    });
    return res.status(200).json({ status: 200, data: userData, message: 'Succesfully logged in' });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

AuthController.register = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    const userData = await AuthService.register({
      email,
      fullName,
      password,
    });
    return res.status(200).json({ status: 200, data: userData, message: 'Succesfully registered' });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

AuthController.getCurrent = async (req, res) => res
  .status(200)
  .json({ status: 200, data: { email: req.user.email, fullName: req.user.fullName } });

AuthController.logout = async (req, res) => {
  try {
    AuthService.logout({
      user: req.user,
      foundToken: req.token,
    });
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

AuthController.logoutAll = async (req, res) => {
  try {
    AuthService.logoutAll({
      user: req.user,
    });
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

export default AuthController;
