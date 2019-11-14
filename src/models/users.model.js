import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;
const saltRounds = 10;

// This Schema is for supporting the service implementation (ODE-50)
// FIXME: If you work on ODE-49, please edit the Schema
// DO NOT CHANGE methos below
const UsersSchema = new Schema({
  email: String,
  password: String,
  name: String,
});

// hash pass before creating User
UsersSchema.pre('save', (next) => {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

UsersSchema.methods.validatePassword = (password) => {
  const hashedPass = bcrypt.hashSync(password, saltRounds);
  return this.password === hashedPass;
};

UsersSchema.methods.generateJWT = () => {
  const now = new Date();
  const expirationDate = new Date(now);
  expirationDate.setDate(now.getDate() + 60);

  return jwt.sign({
    email: this.email,
    // eslint-disable-next-line no-underscore-dangle
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
};

UsersSchema.methods.toAuthJSON = () => ({
  // eslint-disable-next-line no-underscore-dangle
  _id: this._id,
  email: this.email,
  token: this.generateJWT(),
});

export default mongoose.model('Users', UsersSchema);
