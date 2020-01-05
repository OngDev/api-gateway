/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import ChaiAsPromised from 'chai-as-promised';
import dotenv from 'dotenv';

import UserModel from '../../../models/user.model';
import AuthService from '../../../services/auth.service';

chai.use(ChaiAsPromised);
dotenv.config();

describe('### Authentication service IT', () => {
  describe('Register function', () => {
    after(() => {
      UserModel.deleteMany({});
    });

    it('when input data is correct, should return a registered user and a token', async () => {
      const registerPayload = {
        email: 'test@mail.com',
        fullName: 'test user',
        password: 'password',
      };
      const data = await AuthService.register(registerPayload);
      expect(data.token).to.be.exist;
      expect(data.user).to.be.exist;
      expect(data.user.fullName).equal('test user');
      expect(data.user.email).equal('test@mail.com');
    });

    it('when email is empty, should receive an Email is required error', async () => {
      const registerPayload = {
        fullName: 'Test User',
        password: 'pass',
      };
      await expect(AuthService.register(registerPayload))
        .to.eventually.be.rejectedWith('Email is required!')
        .and.be.an.instanceOf(Error);
    });

    it('when full name is empty, should receive a Fullname is required error', async () => {
      const registerPayload = {
        email: 'test@mail.com',
        password: 'pass',
      };
      await expect(AuthService.register(registerPayload))
        .to.eventually.be.rejectedWith('Fullname is required!')
        .and.be.an.instanceOf(Error);
    });

    it('when password is empty, should receive an Password is required error', async () => {
      const registerPayload = {
        email: 'test@mail.com',
        fullName: 'Test User',
      };
      await expect(AuthService.register(registerPayload))
        .to.eventually.be.rejectedWith('Password is required!')
        .and.be.an.instanceOf(Error);
    });

    it('when email has wrong format, should receive an invalid email error', async () => {
      const registerPayload = {
        email: 'testmail.com',
        fullName: 'Test User',
        password: 'pass',
      };
      await expect(AuthService.register(registerPayload))
        .to.eventually.be.rejectedWith('testmail.com is not a valid email!')
        .and.be.an.instanceOf(Error);
    });

    it('when password is shorter than 8, should receive an invalid password error', async () => {
      const registerPayload = {
        email: 'test1@mail.com',
        fullName: 'Test User',
        password: 'pass',
      };
      await expect(AuthService.register(registerPayload))
        .to.eventually.be.rejectedWith('Password must be longer than 8')
        .and.be.an.instanceOf(Error);
    });
  });
  describe('Login function', () => {
    before(async () => {
      const user = new UserModel({
        email: 'chienbm62@gmail.com',
        fullName: 'Bui Minh Chien',
        password: 'Domaybiet!23',
      });
      await user.save();
    });
    after(async () => {
      await UserModel.deleteMany({});
    });
    it('input correct email and password, should receive user and token', async () => {
      const authInfo = {
        email: 'chienbm62@gmail.com',
        password: 'Domaybiet!23',
      };
      const res = await AuthService.login(authInfo);
      expect(res.user.email).to.be.equal('chienbm62@gmail.com');
      expect(res.token).to.be.exist;
    });

    it('input wrong password, should receive error', async () => {
      const authInfo = {
        email: 'chienbm62@gmail.com',
        password: 'Domaybiet!2',
      };
      await expect(AuthService.login(authInfo))
        .to.eventually.be.rejectedWith('Login failed! Check authentication credentials')
        .and.be.an.instanceOf(Error);
    });

    it('input not existing email, should receive error', async () => {
      const authInfo = {
        email: 'chienbm6@gmail.com',
        password: 'Domaybiet!23',
      };
      await expect(AuthService.login(authInfo))
        .to.eventually.be.rejectedWith('Login failed! Check authentication credentials')
        .and.be.an.instanceOf(Error);
    });
  });
  describe('Logout function', () => {
    let token;
    let user;
    beforeEach(async () => {
      user = new UserModel({
        email: 'chienbm62@gmail.com',
        fullName: 'Bui Minh Chien',
        password: 'Domaybiet!23',
      });
      await user.save();
      token = await AuthService.login({
        email: 'chienbm62@gmail.com',
        password: 'Domaybiet!23',
      }).token;
    });
    afterEach(async () => {
      await UserModel.deleteMany({});
    });

    it('logout and cannot find by Token', async () => {
      await AuthService.logout({
        user,
        foundToken: token,
      });
      expect(user.tokens.indexOf({ token })).equals(-1);
    });
    it('logout all and tokens array has no element', async () => {
      await AuthService.login({
        email: 'chienbm62@gmail.com',
        password: 'Domaybiet!23',
      });
      await AuthService.logoutAll({ user });
      expect(user.tokens.length).equals(0);
    });
  });
});
