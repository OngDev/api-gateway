/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import ChaiAsPromised from 'chai-as-promised';
import dotenv from 'dotenv';

import UserModel from '../../../models/user.model';

chai.use(ChaiAsPromised);
dotenv.config();

describe('### User model IT', () => {
  afterEach(async () => {
    await UserModel.deleteMany({});
  });

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

  describe('User pre creation', () => {
    beforeEach(async () => {
      const user = new UserModel({
        email: 'chienbm62@gmail.com',
        fullName: 'Bui Minh Chien',
        password: 'Domaybiet!23',
      });
      await user.save();
    });
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
    before(async () => {
      const user = new UserModel({
        email: 'chienbm62@gmail.com',
        fullName: 'Bui Minh Chien',
        password: 'Domaybiet!23',
      });
      await user.save();
    });
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

  describe('User save function', () => {
    it('creates a user, should return a user with hashed password', async () => {
      const user = new UserModel({
        email: 'newchienbm62@gmail.com',
        fullName: 'Bui Minh Chien',
        password: 'Domaybiet!23',
      });

      await user.save();

      expect(user.isNew).to.be.false;
      expect(user.password).to.not.be.equal('Domaybiet!23');
    });
  });

  describe('Find user function', () => {
    beforeEach(async () => {
      const user = new UserModel({
        email: 'chienbm62@gmail.com',
        fullName: 'Bui Minh Chien',
        password: 'Domaybiet!23',
      });
      await user.save();
    });
    it('find one user, should return a correct user', async () => {
      const user = await UserModel.findOne({ email: 'chienbm62@gmail.com' });
      expect(user.email).to.be.equal('chienbm62@gmail.com');
      expect(user.fullName).to.be.equal('Bui Minh Chien');
      expect(user.password).to.not.be.equal('Domaybiet!23');
    });
    it('find all user, should return an array', async () => {
      const users = await UserModel.find({});
      expect(Array.isArray(users)).to.be.true;
      expect(users.length).to.be.equal(1);
    });
  });

  describe('remove user function', () => {
    let user;
    beforeEach(async () => {
      user = new UserModel({
        email: 'chienbm62@gmail.com',
        fullName: 'Bui Minh Chien',
        password: 'Domaybiet!23',
      });
      await user.save();
    });

    it('remove user by its instance, cannot find the user later', async () => {
      await user.remove();
      const result = await UserModel.findOne({ email: 'chienbm62@gmail.com' });
      expect(result).to.not.be.exist;
    });
    it('remove multiple users, cannot find the user later', async () => {
      await UserModel.deleteMany({ email: 'chienbm62@gmail.com' });
      const result = await UserModel.findOne({ email: 'chienbm62@gmail.com' });
      expect(result).to.not.be.exist;
    });
    it('remove a user, cannot find the user later', async () => {
      await UserModel.findOneAndDelete({ email: 'chienbm62@gmail.com' });
      const result = await UserModel.findOne({ email: 'chienbm62@gmail.com' });
      expect(result).to.not.be.exist;
    });
    it('remove user by id, cannot find the user later', async () => {
      // eslint-disable-next-line no-underscore-dangle
      await UserModel.findByIdAndRemove(user._id);
      const result = await UserModel.findOne({ email: 'chienbm62@gmail.com' });
      expect(result).to.not.be.exist;
    });
  });

  describe('update user function', () => {
    let user;
    beforeEach(async () => {
      user = new UserModel({
        email: 'chienbm62@gmail.com',
        fullName: 'Bui Minh Chien',
        password: 'Domaybiet!23',
      });
      await user.save();
    });
    const updateHelper = async () => {
      const users = await UserModel.find({});
      expect(users.length).to.be.equal(1);
      expect(users[0].fullName).to.be.equal('Chien Minh Bui');
    };
    it('set and save user using instance', async () => {
      user.set('fullName', 'Chien Minh Bui');
      await user.save();
      await updateHelper();
    });
    it('update one user', async () => {
      await UserModel.updateOne({ fullName: 'Bui Minh Chien' }, { fullName: 'Chien Minh Bui' });
      await updateHelper();
    });
    it('update all matching user using instance', async () => {
      await UserModel.updateMany({ fullName: 'Bui Minh Chien' }, { fullName: 'Chien Minh Bui' });
      await updateHelper();
    });
    it('update a user', async () => {
      await UserModel.findOneAndUpdate({ fullName: 'Bui Minh Chien' }, { fullName: 'Chien Minh Bui' });
      await updateHelper();
    });
    it('set and save user using instance', async () => {
      // eslint-disable-next-line no-underscore-dangle
      await UserModel.findByIdAndUpdate(user._id, { fullName: 'Chien Minh Bui' });
      await updateHelper();
    });
  });

  describe('remove all tokens function', () => {
    it('call remove all, tokens array should be empyy', async () => {
      const user = new UserModel({
        email: 'chienbm62@gmail.com',
        fullName: 'Bui Minh Chien',
        password: 'Domaybiet!23',
      });
      await user.save();
      await user.generateAuthToken();
      await user.generateAuthToken();
      // eslint-disable-next-line no-underscore-dangle
      await UserModel.removeAllTokens(user._id);
      expect(user.tokens.length).equals(0);
    });
  });
});
