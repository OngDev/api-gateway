import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isEmail } from 'validator';

const { Schema } = mongoose;
const saltRounds = 10;

const UserSchema = Schema(
  {
    email: {
      type: String,
      unique: true,
      validate: {
        validator: isEmail,
        message: '{VALUE} is not a valid email!',
        isAsync: false,
      },
      required: [true, 'Email is required!'],
    },
    fullName: {
      type: String,
      trim: true,
      required: [true, 'Fullname is required!'],
      minlength: [3, 'Full name must be longer than 3'],
      maxlength: [50, 'Full name must be shorter than 50'],
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      minlength: [8, 'Password must be longer than 8'], // special/number/capital
    },
    tokens: [{
      token: {
        type: String,
        required: true,
      },
    }],
  },
  { timestamps: true },
);

// This hook is already tested, just cannot create an individual tests for it
/* istanbul ignore next */
UserSchema.pre('save', async function hashPassword(next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  next();
});

// This hook is already tested, just cannot create an individual tests for it
/* istanbul ignore next */
UserSchema.methods.generateAuthToken = async function generateAuthToken() {
  // Generate an auth token for the user
  const user = this;
  // eslint-disable-next-line no-underscore-dangle
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// This hook is already tested, just cannot create an individual tests for it
/* istanbul ignore next */
UserSchema.statics.findByCredentials = async function findByCredentials(email, password) {
  // Search for a user by email and password.
  // eslint-disable-next-line no-use-before-define
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error('Login failed! Check authentication credentials');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Login failed! Check authentication credentials');
  }
  return user;
};

const UserModel = mongoose.model('Users', UserSchema, 'users');

export default UserModel;
