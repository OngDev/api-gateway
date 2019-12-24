/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import InfoService from '../../../services/info.service';
import InfoModel from '../../../models/info.model';

describe('Unit test info services', () => {
  describe('Create service', async () => {
    let info;
    let infoSaved;
    beforeEach(async () => {
      info = new InfoModel({
        key: 'Ông Dev',
        val: {
          handsome: false,
          isMaster: true,
        },
      });
      infoSaved = await InfoService.create(info);
    });
    it('Create info successfully', async () => {
      expect(infoSaved.key).to.equal('Ông Dev');
      expect(infoSaved.val.handsome).to.equal(false);
    });
    afterEach(async () => {
      await InfoModel.deleteMany({});
    });
  });
  describe('List service', async () => {
    let infos;
    beforeEach(async () => {
      await InfoModel.insertMany([
        { key: 'Ông Dev', val: 'bar' },
        { key: 'Ông Chiến', val: 'deptrai' },
      ]);
      infos = await InfoService.list();
    });
    it('List info successfully', async () => {
      expect(infos).to.have.lengthOf(2);
    });
    afterEach(async () => {
      await InfoModel.deleteMany({});
    });
  });
  describe('Read service', async () => {
    let info;
    beforeEach(async () => {
      await InfoModel.insertMany([
        { key: 'Ông Dev', val: 'bar' },
        { key: 'Ông Chiến', val: 'deptrai' },
      ]);
      info = await InfoService.read('Ông Chiến');
    });
    it('Read info successfully', async () => {
      expect(info.val).to.equal('deptrai');
    });
    it('Read info failed', async () => {
      await expect(InfoService.read())
        .to.eventually.be.rejectedWith('Missing "key" field')
        .and.be.an.instanceOf(Error);
    });
    afterEach(async () => {
      await InfoModel.deleteMany({});
    });
  });
  describe('Update service', async () => {
    const infos = [
      { key: 'Ông Dev', val: 'bar' },
      { key: 'Ông Chiến', val: 'deptrai' },
    ];
    let infoUpdated;
    beforeEach(async () => {
      await InfoModel.insertMany(infos);
      infoUpdated = await InfoService.update('Ông Dev', {
        key: 'Ông Ba Bị',
        val: 'bar',
      });
    });
    it('Update info successfully', async () => {
      expect(infoUpdated.key).to.not.equal(infos[0].key);
      expect(infoUpdated.val).to.equal('bar');
    });
    it('Update info failed', async () => {
      await expect(
        InfoService.update({
          key: 'Ông Chiến',
          val: 'bar',
        }),
      )
        .to.eventually.be.rejectedWith('Missing fields')
        .and.be.an.instanceOf(Error);
    });
    afterEach(async () => {
      await InfoModel.deleteMany({});
    });
  });
  describe('Remove service', async () => {
    const infos = [
      { key: 'Ông Dev', val: 'bar' },
      { key: 'Ông Chiến', val: 'deptrai' },
    ];
    let infoRemoved;
    beforeEach(async () => {
      await InfoModel.insertMany(infos);
      infoRemoved = await InfoService.remove('Ông Dev');
    });
    it('Removed info successfully', async () => {
      expect(infoRemoved.message).to.equal('Deleted');
      const info = await InfoModel.findOne({ key: 'Ông Dev' });
      expect(info).to.equal(null);
    });
    it('Remove info failed', async () => {
      await expect(InfoService.remove())
        .to.eventually.be.rejectedWith('Missing "key" field')
        .and.be.an.instanceOf(Error);
    });
    afterEach(async () => {
      await InfoModel.deleteMany({});
    });
  });
});
