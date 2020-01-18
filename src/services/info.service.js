import { assignIn } from 'lodash';
import InfoModel from '../models/info.model';

const InfoService = {};
InfoService.create = async (any) => {
  const info = new InfoModel(any);
  const infoSaved = await info.save();
  return infoSaved;
};
InfoService.list = async () => {
  const infos = await InfoModel.find();
  return infos;
};
InfoService.read = async (key) => {
  try {
    if (!key) {
      throw new Error('Missing "key" field');
    }
    const info = await InfoModel.findOne({ key });
    return info;
  } catch (error) {
    throw Error(error.message);
  }
};
InfoService.update = async (key, body) => {
  try {
    if (!key || !body) {
      throw new Error('Missing fields');
    }
    let info = await InfoModel.findOne({ key });
    info = assignIn(info, body);
    const infoUpdated = await info.save();
    return infoUpdated;
  } catch (error) {
    throw Error(error.message);
  }
};
InfoService.remove = async (key) => {
  try {
    if (!key) {
      throw new Error('Missing "key" field');
    }
    await InfoModel.remove({ key });
    return { message: 'Deleted' };
  } catch (error) {
    throw new Error(error.message);
  }
};

export default InfoService;
