import mongoose from 'mongoose';

const { Schema } = mongoose;

const InfoSchema = new Schema({
  key: {
    type: String,
    unique: true,
    required: true,
  },
  val: Schema.Types.Mixed,
});

const InfoModel = mongoose.model('Infos', InfoSchema, 'infos');


export default InfoModel;
