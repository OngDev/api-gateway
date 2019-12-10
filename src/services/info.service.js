import { assignIn } from 'lodash';
import InfoModel from '../models/info.model';

exports.create = async (any) => {
  try {
    if (!any.key) {
      throw new Error('Missing "key" field');
    }
    const info = new InfoModel(any);
    const infoSaved = await info.save();
    return infoSaved;
  } catch (error) {
    throw Error(error.message);
  }
};
exports.list = async () => {
  try {
    const infos = await InfoModel.find();
    return infos;
  } catch (error) {
    throw Error(error.message);
  }
};

exports.read = async (key) => {
  try {
    const info = await InfoModel.findOne({ key });
    return info;
  } catch (error) {
    throw Error(error.message);
  }
};

exports.update = async (key, body) => {
  try {
    let info = await InfoModel.findOne({ key });
    info = assignIn(info, body);
    const infoUpdated = await info.save();
    return infoUpdated;
  } catch (error) {
    throw Error(error.message);
  }
};

exports.remove = async (key) => {
  try {
    await InfoModel.remove({ key });
    return { message: 'Đã xóa!' };
  } catch (error) {
    throw Error(error.message);
  }
};
