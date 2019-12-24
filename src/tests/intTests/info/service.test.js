/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import InfoService from '../../../services/info.service';
import InfoModel from '../../../models/info.model';

describe('Test info service', () => {
  afterEach(async () => {
    await InfoModel.deleteMany();
  });
  describe('Info service availability', () => {
    it('Info Service object should be exist', () => {
      expect(InfoService).to.exist;
    });
    it('Create function should be exist', () => {
      expect(InfoService.create).to.exist;
    });
    it('Read function should be exist', () => {
      expect(InfoService.read).to.exist;
    });
    it('List function should be exist', () => {
      expect(InfoService.list).to.exist;
    });
    it('Update all function should be exist', () => {
      expect(InfoService.update).to.exist;
    });
  });
  describe('Create service', async () => {
    it('Create info successfully', async () => {
      const infoSaved = await InfoService.create({
        key: 'Ông Dev',
        val: {
          handsome: false,
          isMaster: true,
        },
      });
      expect(infoSaved.key).to.equal('Ông Dev');
      expect(infoSaved.val.handsome).to.equal(false);
    });
  });
  describe('List info service', () => {
    beforeEach(async () => {
      await InfoModel.insertMany([
        { key: 'Ông Dev', val: 'bar' },
        { key: 'Ông Chiến', val: 'deptrai' },
      ]);
    });
    it('should return list info', async () => {
      const infos = await InfoService.list();
      expect(infos).to.have.lengthOf(2);
    });
  });
  describe('Read info service', () => {
    beforeEach(async () => {
      await InfoModel.insertMany([
        { key: 'Ông Dev', val: 'bar' },
        { key: 'Ông Chiến', val: 'deptrai' },
      ]);
    });
    it('should return info', async () => {
      const info = await InfoService.read('Ông Chiến');
      expect(info.val).to.equal('deptrai');
    });
    it('should return info', async () => {
      try {
        await InfoService.read();
      } catch (error) {
        expect(error.message).to.equal('Missing "key" field');
      }
    });
  });
  describe('Update info service', () => {
    beforeEach(async () => {
      await InfoModel.insertMany([
        { key: 'Ông Dev', val: 'bar123' },
        { key: 'Ông Chiến', val: 'deptrai123' },
      ]);
    });
    it('should return info updated', async () => {
      const infoUpdated = await InfoService.update('Ông Dev', {
        key: 'Ông Ba Bị',
        val: 'bar',
      });
      expect(infoUpdated.key).to.equal('Ông Ba Bị');
      expect(infoUpdated.val).to.equal('bar');
    });
    it('should return error', async () => {
      try {
        await InfoService.update({
          key: 'Ông Chiến',
          val: 'bar',
        });
      } catch (error) {
        expect(error.message).to.equal('Missing fields');
      }
    });
  });
  describe('Remove info service', () => {
    beforeEach(async () => {
      await InfoModel.insertMany([
        { key: 'Ông Dev', val: 'bar' },
        { key: 'Ông Chiến', val: 'deptrai' },
      ]);
    });
    it('should return message success when remove info successfully', async () => {
      const response = await InfoService.remove('Ông Dev');
      expect(response.message).to.equal('Deleted');
      const info = await InfoModel.findOne({ key: 'Ông Dev' });
      expect(info).to.equal(null);
    });
    it('should return mesage missing field', async () => {
      try {
        await InfoService.remove();
      } catch (error) {
        expect(error.message).to.equal('Missing "key" field');
      }
    });
  });
});
