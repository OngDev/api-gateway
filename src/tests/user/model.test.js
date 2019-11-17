/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import UserModel from '../../models/user.model';

describe('User model should work properly', () => {
  describe('User validation', () => {
    it('should return errors if invalided fields exist', () => {
      const user = new UserModel({
        email: 'chienbm62',
        fullName: '',
        salted: '7nWZLcCK0vsPzIM',
        hashed: '0510210d4b370165658bdc0d0b005244',
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
        salted: '7nWZLcCK0vsPzIM',
        hashed: '0510210d4b370165658bdc0d0b005244',
      });
      user.validate((err) => {
        expect(err).to.not.exist;
      });
    });
  });
});
