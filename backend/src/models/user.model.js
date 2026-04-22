import mongoosePaginate from 'mongoose-paginate-v2';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const loginTypeEnum = ['EMAIL_PASSWORD', 'GITHUB', 'GOOGLE'];

export const loginStatusEnum = ['active', 'inactive'];

export const loginRoleEnum = ['customer', 'admin', 'seller', 'user'];

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'FullName is required'],
      trim: true,
      maxlength: [50, 'FullName cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    loginType: {
      type: String,
      enum: loginTypeEnum,
      default: loginTypeEnum[0],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned in queries by default
    },
    role: {
      type: String,
      enum: loginRoleEnum,
      default: loginRoleEnum[0],
    },
    status: {
      type: String,
      enum: loginStatusEnum,
      default: loginStatusEnum[0],
    },
    favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    phoneNumber: {
      type: String,
      trim: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    avatar: { type: String, default: 'https://avatar.iran.liara.run/public' }, // cloudinary url
    refreshToken: String,
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    emailVerificationToken: String,
    emailVerificationExpiry: Date,
    storageUsed: { type: Number, default: 0 },
    storageLimit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.index({ email: 'text', createdAt: -1 });

userSchema.plugin(mongoosePaginate);

// Pre-save middleware to hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare the provided password with the stored hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token on short time for the user
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id }, process.env.SECRET_TOKEN, {
    expiresIn: '7d',
  });
};

// Method to generate a refresh token on long time for the user
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.SECRET_TOKEN, {
    expiresIn: '30d',
  });
};

//  Method responsible for generating tokens for email verification, password reset etc.
userSchema.methods.generateTemporaryToken = () => {
  const unHashedToken = crypto.randomBytes(20).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(unHashedToken)
    .digest('hex');
  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes
  return { hashedToken, tokenExpiry, unHashedToken };
};

export const User = mongoose.model('User', userSchema);
