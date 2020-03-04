import InfoService from '../services/info.service';

const InfoController = {};

InfoController.read = async (req, res) => {
  try {
    const infoData = await InfoService.read(req.body.key);
    return res.status(200).json({ status: 200, data: infoData });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

InfoController.update = async (req, res) => {
  try {
    const { key } = req.body;
    const infoData = await InfoService.update(key, req.body);
    return res
      .status(200)
      .json({ status: 200, data: infoData, message: 'Updated!' });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

InfoController.create = async (req, res) => {
  try {
    const infoData = await InfoService.create(req.body);
    return res
      .status(200)
      .json({ status: 200, data: infoData, message: 'Created!' });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

InfoController.remove = async (req, res) => {
  try {
    const infoData = await InfoService.remove(req.body);
    return res
      .status(200)
      .json({ status: 200, data: infoData, message: 'Removed!' });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};
