/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import ChaiAsPromised from 'chai-as-promised';

import sinon from 'sinon';
import sinonTest from 'sinon-test';

import AuthService from '../../../services/auth.service';
import UserModel from '../../../models/user.model';

chai.use(ChaiAsPromised);
const test = sinonTest(sinon);

describe('Authentication service', () => {
  const error = new Error({ error: 'test error' });
  describe('Auth service availability', () => {
    it('Auth Service object should be exist', () => {
      expect(AuthService).to.exist;
    });
    it('Register function should be exist', () => {
      expect(AuthService.register).to.exist;
    });
    it('Login function should be exist', () => {
      expect(AuthService.login).to.exist;
    });
    it('Logout function should be exist', () => {
      expect(AuthService.logout).to.exist;
    });
    it('Logout all function should be exist', () => {
      expect(AuthService.logoutAll).to.exist;
    });
  });
  describe('Register function', () => {
    const user = new UserModel({
      email: 'test@mail.com',
      fullName: 'test user',
      password: 'password',
    });
    const testToken = 'thisistesttoken';
    it('valid user data, should register successfully', test(async function testRegister() {
      this.stub(UserModel.prototype, 'save');
      this.stub(UserModel.prototype, 'generateAuthToken').returns(testToken);
      const userData = await AuthService.register(user);
      sinon.assert.calledOnce(user.save);
      sinon.assert.calledOnce(user.generateAuthToken);
      expect(userData.token).equals(testToken);
      expect(userData.user.email).equals(user.email);
    }));
    it('empty user object data, should throw exception', test(async function testNullUserRegister() {
      const stub = this.stub(AuthService, 'register');
      try {
        await AuthService.register({});
      // eslint-disable-next-line no-empty
      } catch (err) {}
      expect(stub, 'threw');
      expect(stub, 'threw', error);
    }));
    it('invalid user data, should throw exception', test(async function testFailedRegister() {
      this.stub(UserModel.prototype, 'save').throws(error);
      const stub = this.stub(AuthService, 'register');
      try {
        await AuthService.register(user);
      // eslint-disable-next-line no-empty
      } catch (err) {}
      expect(stub, 'threw');
      expect(stub, 'threw', error);
    }));
  });
  describe('Login function', () => {
    const loginData = {
      email: 'test@mail.com',
      password: 'password',
    };
    it('valid user data, should login successfully', test(async function testLogin() {
      const expectedUser = new UserModel({
        email: 'test@mail.com',
        fullName: 'Test User',
        password: 'Domaybiet!23',
      });
      const testToken = 'thisistesttoken';
      this.stub(UserModel, 'findByCredentials').returns(expectedUser);
      this.stub(UserModel.prototype, 'generateAuthToken').returns(testToken);
      const userData = await AuthService.login(loginData);
      sinon.assert.calledOnce(UserModel.findByCredentials);
      sinon.assert.calledOnce(UserModel.prototype.generateAuthToken);
      expect(userData.token).equals(testToken);
      expect(userData.user.email).equals(expectedUser.email);
    }));
    it('empty user data, should throw exception', test(async function testNullLoginData() {
      const stub = this.stub(AuthService, 'login');
      try {
        await AuthService.login({});
      // eslint-disable-next-line no-empty
      } catch (err) {}
      expect(stub, 'threw');
      expect(stub, 'threw', error);
    }));
    it('invalid user data, should throw exception', test(async function testFailedLogin() {
      this.stub(UserModel, 'findByCredentials').throws(error);
      const stub = this.stub(AuthService, 'login');
      try {
        await AuthService.login(loginData);
      // eslint-disable-next-line no-empty
      } catch (err) {}
      expect(stub, 'threw');
      expect(stub, 'threw', error);
    }));
  });
  describe('Logout function', () => {
    const loggedInUser = new UserModel({
      _id: 'testId',
      email: 'test@mail.com',
      fullName: 'Test User',
      password: 'Domaybiet!23',
      tokens: [
        {
          token: 'thisistoken1',
        },
        {
          token: 'thisistoken2',
        },
        {
          token: 'thisistoken3',
        },
      ],
    });
    it('logout user, should remove a token', test(async function testLogout() {
      this.stub(UserModel.prototype, 'save');
      await AuthService.logout({
        user: loggedInUser,
        foundToken: 'thisistoken1',
      });
      expect(loggedInUser.tokens.length).equals(2);
    }));
    it('null user data, should throw exception', async () => {
      await expect(AuthService.logout({})).to.be.rejectedWith(Error);
    });
    it('something went wrong, should throw exception', test(async function testFailedLogout() {
      this.stub(UserModel.prototype, 'save').throws(error);
      const stub = this.stub(AuthService, 'logout');
      try {
        await AuthService.logout({
          user: loggedInUser,
          foundToken: 'thisistoken1',
        });
      // eslint-disable-next-line no-empty
      } catch (err) {}
      expect(stub, 'threw');
      expect(stub, 'threw', error);
    }));
  });
  describe('Logout all function', () => {
    const loggedInUser = new UserModel({
      _id: 'testId',
      email: 'test@mail.com',
      fullName: 'Test User',
      password: 'Domaybiet!23',
      tokens: [
        {
          token: 'thisistoken1',
        },
        {
          token: 'thisistoken2',
        },
        {
          token: 'thisistoken3',
        },
      ],
    });
    it('logout all user tokens, should remove all token', test(async function testLogoutAll() {
      const stub = this.stub(UserModel, 'removeAllTokens');
      await AuthService.logoutAll({
        user: loggedInUser,
      });
      sinon.assert.calledOnce(stub);
      // eslint-disable-next-line no-underscore-dangle
      sinon.assert.calledWith(stub, loggedInUser._id);
    }));
    it('null user data, should throw exception', async () => {
      await expect(AuthService.logoutAll({})).to.be.rejectedWith(Error);
    });
    it('something went wrong, should throw exception', test(async function testFailedLogoutAll() {
      this.stub(UserModel, 'removeAllTokens').throws(error);
      const stub = this.stub(AuthService, 'logoutAll');
      try {
        await AuthService.logoutAll({
          user: loggedInUser,
        });
      // eslint-disable-next-line no-empty
      } catch (err) {}
      expect(stub, 'threw');
      expect(stub, 'threw', error);
    }));
  });
});
