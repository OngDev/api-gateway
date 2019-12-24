/* eslint-disable no-unused-expressions */
import sinon from 'sinon';
import sinonTest from 'sinon-test';

import AuthController from '../../../controllers/auth.controller';
import AuthService from '../../../services/auth.service';

const test = sinonTest(sinon);

describe('Authentication controller', () => {
  // server error
  const error = new Error({ error: 'blah blah' });
  let res = {};
  let expectedResult;
  describe('Login function', () => {
    const req = {
      body: {
        email: 'test@mail.com',
        password: 'password',
      },
    };
    beforeEach(() => {
      res = {
        status: sinon.stub().returns({
          json: sinon.spy(),
        }),
      };
    });
    it('input valid username and password, should return user and token', test(async function testLogin() {
      expectedResult = {
        user: {
          email: 'test@mail.com',
          fullName: 'Test User',
        },
        token: 'thisistoken',
      };
      this.stub(AuthService, 'login').withArgs(req.body).returns(expectedResult);
      await AuthController.login(req, res);
      sinon.assert.calledWith(AuthService.login, req.body);
      sinon.assert.calledOnce(AuthService.login);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.status(200).json, sinon.match({ status: 200 }));
      sinon.assert.calledWith(res.status(200).json, sinon.match({ data: expectedResult }));
    }));
    it('input invalid username and password, should receive error', test(async function testLoginFailed() {
      this.stub(AuthService, 'login').throws(error);
      await AuthController.login(req, res);
      sinon.assert.calledWith(AuthService.login, req.body);
      sinon.assert.calledOnce(AuthService.login);
      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledWith(res.status(400).json, sinon.match({ status: 400 }));
      sinon.assert.calledWith(res.status(400).json, sinon.match({ message: error.message }));
    }));
  });
  describe('Register function', () => {
    const req = {
      body: {
        email: 'test@mail.com',
        fullName: 'test user',
        password: 'password',
      },
    };
    beforeEach(() => {
      res = {
        status: sinon.stub().returns({
          json: sinon.spy(),
        }),
      };
    });
    it('new user data is valid, should return user and token', test(async function registerTest() {
      expectedResult = {
        user: {
          email: 'test@mail.com',
          fullName: 'Test User',
        },
        token: 'thisistoken',
      };
      this.stub(AuthService, 'register').withArgs(req.body).returns(expectedResult);
      await AuthController.register(req, res);
      sinon.assert.calledWith(AuthService.register, req.body);
      sinon.assert.calledOnce(AuthService.register);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.status(200).json, sinon.match({ status: 200 }));
      sinon.assert.calledWith(res.status(200).json, sinon.match({ data: expectedResult }));
    }));
    it('new user data is invalid, should receive error', test(async function testRegisterFailed() {
      this.stub(AuthService, 'register').throws(error);
      await AuthController.register(req, res);
      sinon.assert.calledOnce(AuthService.register);
      sinon.assert.calledWith(AuthService.register, req.body);
      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledWith(res.status(400).json, sinon.match({ status: 400 }));
      sinon.assert.calledWith(res.status(400).json, sinon.match({ message: error.message }));
    }));
  });
  describe('Get current function', () => {
    const req = {
      user: {
        email: 'test@mail.com',
        fullName: 'test user',
      },
    };
    beforeEach(() => {
      res = {
        status: sinon.stub().returns({
          json: sinon.spy(),
        }),
      };
    });
    it('should return user data', test(async () => {
      await AuthController.getCurrent(req, res);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.status(200).json, sinon.match({ status: 200 }));
      sinon.assert.calledWith(res.status(200).json,
        sinon.match({ data: sinon.match({ email: req.user.email }) }));
      sinon.assert.calledWith(res.status(200).json,
        sinon.match({ data: sinon.match({ fullName: req.user.fullName }) }));
    }));
  });
  describe('Logout function', () => {
    const req = {
      user: {
        email: 'test@mail.com',
        fullName: 'test user',
      },
      token: 'thisistoken',
    };
    beforeEach(() => {
      res = {
        send: sinon.spy(),
        status: sinon.stub().returns({
          send: sinon.spy(),
        }),
      };
    });
    it('found session, should logout user', test(async function testLogout() {
      this.stub(AuthService, 'logout');
      await AuthController.logout(req, res);
      sinon.assert.calledWith(AuthService.logout, {
        user: req.user,
        foundToken: req.token,
      });
      sinon.assert.calledOnce(AuthService.logout);
      sinon.assert.calledOnce(res.send);
    }));
    it('server error, should receive status 500', test(async function testLogoutFailed() {
      this.stub(AuthService, 'logout').throws(error);
      await AuthController.logout(req, res);
      sinon.assert.calledWith(AuthService.logout, {
        user: req.user,
        foundToken: req.token,
      });
      sinon.assert.calledOnce(AuthService.logout);
      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.status(500).send, error);
    }));
  });
  describe('Logout all function', () => {
    const req = {
      user: {
        email: 'test@mail.com',
        fullName: 'test user',
      },
      token: 'thisistoken',
    };
    beforeEach(() => {
      res = {
        send: sinon.spy(),
        status: sinon.stub().returns({
          send: sinon.spy(),
        }),
      };
    });
    it('found session, should logout user from all sessions', test(async function testLogoutAll() {
      this.stub(AuthService, 'logoutAll');
      await AuthController.logoutAll(req, res);
      sinon.assert.calledWith(AuthService.logoutAll, {
        user: req.user,
      });
      sinon.assert.calledOnce(AuthService.logoutAll);
      sinon.assert.calledOnce(res.send);
    }));
    it('server error, should receive status 500', test(async function testLogoutAllFailed() {
      this.stub(AuthService, 'logoutAll').throws(error);
      await AuthController.logoutAll(req, res);
      sinon.assert.calledWith(AuthService.logoutAll, {
        user: req.user,
      });
      sinon.assert.calledOnce(AuthService.logoutAll);
      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.status(500).send, error);
    }));
  });
});
