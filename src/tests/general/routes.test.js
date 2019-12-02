import apiRoutes from '../../routes/routes';

const assert = require('assert');

describe('Routes should work properly', () => {
  describe('Router exists', () => {
    it('should have an object for api routes', () => {
      assert.ok(apiRoutes, 'ApiRouter is available');
    });
  });
});
