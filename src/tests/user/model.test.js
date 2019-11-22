/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import ChaiAsPromised from 'chai-as-promised';
import dotenv from 'dotenv';

import UserModel from '../../models/user.model';
import prepareTestDatabase from '../helpers/test.helper';

chai.use(ChaiAsPromised);
dotenv.config();

describe('User model should work properly', () => {
  describe('User validation', () => {
    it('should return errors if invalided fields exist', () => {
      const user = new UserModel({
        email: 'chienbm62',
        fullName: '',
        password: '0510210d4b370165658bdc0d0b005244',
      });
      user.validate((err) => {
        expect(err.errors.email).to.exist;
        expect(err.errors.email.message).equal(
          'chienbm62 is not a valid email!',
        );
        expect(err.errors.fullName).to.exist;
        expect(err.errors.fullName.message).equal(
          'Fullname is required!',
        );
      });
    });
    it('should pass all validator', () => {
      const user = new UserModel({
        email: 'chienbm62@gmail.com',
        fullName: 'Bui Minh Chien',
        password: 'Domaybiet!23',
      });
      user.validate((err) => {
        expect(err).to.not.exist;
      });
    });
  });
});

describe('User Model test with database', () => {
  prepareTestDatabase();
  beforeEach(async () => {
    const user = new UserModel({
      email: 'chienbm62@gmail.com',
      fullName: 'Bui Minh Chien',
      password: 'Domaybiet!23',
    });
    await user.save();
  });
  afterEach(async () => {
    await UserModel.deleteMany({});
  });
  describe('User pre creation', () => {
    it('should generate salt and hash when new User', async () => {
      const user = await UserModel.findOne({ email: 'chienbm62@gmail.com' });
      expect(user.password).to.not.equal('Domaybiet!23');
      expect(user.password.length).to.not.equal(12);
    });
    it('should generate token and update a user', async () => {
      const user = await UserModel.findOne({ email: 'chienbm62@gmail.com' });
      const token = await user.generateAuthToken();
      expect(UserModel.findOne({ 'tokens.token': token })).to.be.exist;
    });
  });
  describe('User find by credentials function', () => {
    it('should match the correct user', async () => {
      const checkedUser = await UserModel.findByCredentials('chienbm62@gmail.com', 'Domaybiet!23');
      expect(checkedUser).to.be.exist;
      expect(checkedUser.email).to.be.equal('chienbm62@gmail.com');
    });
    it('should not match the correct user password', async () => {
      await expect(UserModel.findByCredentials('chienbm62@gmail.com', 'Domaybiet23')).to.be.rejectedWith(Error);
    });
    it('should not receive a user with wrong email', async () => {
      await expect(UserModel.findByCredentials('chienbm621@gmail.com', 'Domaybiet!23')).to.be.rejectedWith(Error);
    });
  });
});
