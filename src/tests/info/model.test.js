import chai, { expect } from 'chai';
import dotenv from 'dotenv';
import ChaiAsPromised from 'chai-as-promised';
import InfoModel from '../../models/info.model';

dotenv.config();
chai.use(ChaiAsPromised);
describe('Info model', () => {
  beforeEach(async () => {
    await InfoModel.insertMany([
      {
        key: 'Ông dev',
        val: {
          name: 'Bùi Minh Chiến',
          class: '58TH1',
          school: 'Đại học Thủy Lợi',
          handsome: true,
          isGoodBoy: true,
        },
      },
      {
        key: 'Ông Bùi Minh Chiến',
        val: {
          name: 'Ông Chiến',
          class: '58TH1',
          school: 'Đại học Thủy Lợi',
          handsome: true,
          isGoodBoy: true,
        },
      },
    ]);
  });
  afterEach(async () => {
    await InfoModel.deleteMany();
  });
  describe('Should save model successfully', async () => {
    const info = new InfoModel({
      key: 'Bùi Minh Chiến',
      val: {
        className: '58TH1',
        school: 'Đại học Thủy Lợi',
      },
    });
    const infoSaved = await info.save();
    expect(infoSaved.key).to.be.equal('Bùi Minh Chiến');
    expect(infoSaved.val.school).to.be.equal('Đại học Thủy Lợi');
  });
  describe('Should save model failed', async () => {
    it('should return duplicate field error', async () => {
      const info = new InfoModel({
        key: 'Ông dev',
        val: {
          className: '58TH1',
          school: 'Đại học Thủy Lợi',
        },
      });
      try {
        await info.save();
      } catch (error) {
        expect(error.code).to.equal(11000);
      }
    });
    it('should return required error', async () => {
      const info = new InfoModel({
        val: {
          className: '58TH1',
          school: 'Đại học Thủy Lợi',
        },
      });
      info.validate((err) => {
        expect(err.name).to.equal('ValidationError');
        expect(err.message).to.equal(
          'Infos validation failed: key: Path `key` is required.',
        );
      });
    });
  });
  describe('Find info function', async () => {
    it('find one info, should return a correct info', async () => {
      const info = await InfoModel.findOne({ key: 'Ông dev' });
      expect(info.val.name).to.be.equal('Bùi Minh Chiến');
      expect(info.val.class).to.be.equal('58TH1');
      expect(info.val.handsome).to.be.equal(true);
    });
  });
  describe('Update info function', async () => {
    it('Update info successfully', async () => {
      const info = await InfoModel.findOne({ key: 'Ông dev' });
      info.val.name = 'Anh Duy';
      info.val.handsome = false;
      const infoSaved = await info.save();
      expect(infoSaved.val.name).to.be.equal('Anh Duy');
      expect(infoSaved.val.class).to.be.equal('58TH1');
      expect(infoSaved.val.handsome).to.be.equal(false);
    });
    it('Update info duplicated', async () => {
      const info = await InfoModel.findOne({ key: 'Ông dev' });
      info.key = 'Ông Bùi Minh Chiến';
      try {
        await info.save();
      } catch (error) {
        expect(error.code).to.equal(11000);
      }
    });
  });
  describe('Delete info function', async () => {
    it('Delete info successfully', async () => {
      const info = await InfoModel.findOne({ key: 'Ông dev' });
      await info.remove();
      const infoRemoved = await InfoModel.findOne({ key: 'Ông Dev' });
      expect(infoRemoved).to.equal(null);
    });
  });
});
