import { expect } from 'chai';
import apiRoutes from '../../../routes/routes';

describe('Routes should work properly', () => {
  describe('Router exists', () => {
    it('should have an object for api routes', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(apiRoutes).to.be.exist;
    });
  });
});
