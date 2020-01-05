import UserModel from '../models/user.model';

const AuthService = {};

AuthService.login = async ({ email, password }) => {
  try {
    const userData = await UserModel.findByCredentials(email, password);
    const token = await userData.generateAuthToken();
    return {
      user: {
        email: userData.email,
        fullName: userData.fullName,
      },
      token,
    };
  } catch (error) {
    throw Error(error.message);
  }
};

AuthService.register = async (newUser) => {
  try {
    const userData = new UserModel(newUser);
    await userData.save();
    const token = await userData.generateAuthToken();
    return {
      user: {
        email: userData.email,
        fullName: userData.fullName,
      },
      token,
    };
  } catch (error) {
    throw Error(error.message);
  }
};

AuthService.logout = async ({ user, foundToken }) => {
  try {
    // eslint-disable-next-line no-param-reassign
    user.tokens = user.tokens.filter((token) => token.token !== foundToken);
    await user.save();
  } catch (error) {
    throw Error(error.message);
  }
};

AuthService.logoutAll = async ({ user }) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    await UserModel.removeAllTokens(user._id);
  } catch (error) {
    throw Error(error.message);
  }
};

export default AuthService;
