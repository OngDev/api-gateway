import UserModel from '../models/user.model';

const AuthService = {};

AuthService.login = async ({ email, password }) => {
  try {
    const user = await UserModel.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    return { user, token };
  } catch (error) {
    throw Error(error.message);
  }
};

AuthService.register = async (newUser) => {
  try {
    const user = new UserModel(newUser);
    await user.save();
    const token = await user.generateAuthToken();
    return { user, token };
  } catch (error) {
    throw Error(error.message);
  }
};

export default AuthService;
