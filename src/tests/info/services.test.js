import chai, { expect } from 'chai';
import dotenv from 'dotenv';
import ChaiAsPromised from 'chai-as-promised';
import InfoService from '../../services/info.service';
import InfoModel from '../../models/info.model';

chai.use(ChaiAsPromised);
dotenv.config();

describe('Test info service', () => {
  afterEach(async () => {
    await InfoModel.deleteMany();
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
    });
    it('Create info failed', async () => {
      try {
        await InfoService.create({
          val: {
            handsome: false,
            isMaster: true,
          },
        });
      } catch (error) {
        expect(error.message).to.equal('Missing "key" field');
      }
    });
  });
  describe('List info service', () => {
    beforeEach(async () => {
      await InfoModel.insertMany([
        { key: 'Ông Dev', value: 'bar' },
        { key: 'Ông Chiến', value: 'deptrai' },
      ]);
    });
    it('should return list info', async () => {
      const infos = await InfoService.list();
      expect(infos).to.have.lengthOf(2);
    });
  });
  describe('Update info service', () => {
    beforeEach(async () => {
      await InfoModel.insertMany([
        { key: 'Ông Dev', value: 'bar123' },
        { key: 'Ông Chiến', value: 'deptrai123' },
      ]);
    });
    it('should return info updated', async () => {
      const infoUpdated = await InfoService.update('Ông Dev', {
        key: 'Ông Ba Bị',
        value: 'bar',
      });
      expect(infoUpdated.key).to.equal('Ông Ba Bị');
      expect(infoUpdated.value).to.equal('bar');
    });
  });
  describe('Remove info service', () => {
    beforeEach(async () => {
      await InfoModel.insertMany([
        { key: 'Ông Dev', value: 'bar' },
        { key: 'Ông Chiến', value: 'deptrai' },
      ]);
    });
    it('should return message success when remove info successfully', async () => {
      const response = await InfoService.remove('Ông Dev');
      expect(response.message).to.equal('Đã xóa!');
      const info = await InfoModel.findOne({ key: 'Ông Dev' });
      expect(info).to.equal(null);
    });
  });
});
