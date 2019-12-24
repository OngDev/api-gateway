/* eslint-disable no-console */
import sinon from 'sinon';
import logger from '../../../logger/logger';

const assert = require('assert');


describe('Logger should work properly', () => {
  describe('Existing object', () => {
    it('should have an object for logger', () => {
      assert.ok(logger, 'Logger is available');
    });
  });
  describe('Logger should show correct log', () => {
    beforeEach(() => {
      console.log = sinon.spy();
    });

    it('info logger should log correct info', () => {
      logger.info('hello');
      assert.ok(console.log.calledOnce);
    });

    it('debug logger should log correct debug', () => {
      logger.debug('hello');
      assert.ok(console.log.calledOnce);
    });

    it('error logger should log correct error', () => {
      logger.error('hello');
      assert.ok(console.log.calledOnce);
    });
  });
});
