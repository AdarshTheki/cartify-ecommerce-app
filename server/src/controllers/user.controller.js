import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { isValidObjectId } from 'mongoose';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { removeSingleImg, uploadSingleImg } from '../utils/cloudinary.js';
import {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
} from '../utils/mail.js';

const cookiePayload = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'PRODUCTION',
};

const selectedUser = {
  email: 1,
  role: 1,
  status: 1,
  phoneNumber: 1,
  fullName: 1,
  avatar: 1,
  loginType: 1,
};

// @desc    Get all users (admin only)
// @route   GET /api/v1/users
// @access  Admin
export const getAllUserByAdmin = asyncHandler(async (req, res) => {
  const page = +req.query?.page || 1;
  const limit = +req.query?.limit || 10;
  const q = req.query?.query || '';
  const status = req.query?.status || '';
  const sort = req.query?.sort || 'fullName';
  const order = req.query?.order || 'asc';

  const query = {
    role: { $ne: 'admin' },
    fullName: { $regex: q, $options: 'i' },
    status: { $in: status ? [status] : ['active', 'inactive'] },
  };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sort]: order === 'asc' ? 1 : -1 },
    select: Object.keys(selectedUser).join(' '),
  };

  const users = await User.paginate(query, options);

  return res
    .status(200)
    .json(new ApiResponse(200, users, 'Users retrieved successfully'));
});

// @desc    Get single user by ID (admin only)
// @route   GET /api/v1/users/:id
// @access  Admin
export const getUserIdByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid user ID');
  }

  const user = await User.findById(id).select(selectedUser);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User retrieved successfully'));
});

// @desc    Create a new user (admin only)
// @route   POST /api/v1/users
// @access  Admin
export const createUserByAdmin = asyncHandler(async (req, res) => {
  const { phoneNumber, email, status, role, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    throw new ApiError(400, 'Email, password, and full name are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = await User.create({
    phoneNumber,
    email,
    status,
    role,
    password,
    fullName,
  });

  const createdUser = await User.findById(user?._id).select(selectedUser);

  if (!createdUser) {
    throw new ApiError(500, 'User creation failed');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User created successfully'));
});

// @desc    Update user details (admin only)
// @route   PUT /api/v1/users/:id
// @access  Admin
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { phoneNumber, email, status, role, fullName } = req.body;
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid user ID');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.email = email || user.email;
  user.status = status || user.status;
  user.role = role || user.role;
  user.fullName = fullName || user.fullName;

  await user.save({ validateBeforeSave: false });

  const newUser = await User.findById(user._id).select(selectedUser);

  if (!newUser) throw new ApiError(404, 'updated user not found!');

  return res
    .status(200)
    .json(new ApiResponse(200, newUser, 'User updated successfully'));
});

// @desc    Delete a user (admin only)
// @route   DELETE /api/v1/users/:id
// @access  Admin
export const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid user ID');
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'User deleted successfully'));
});

// @desc    Get current logged-in user
// @route   GET /api/v1/users/current
// @access  Private
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(selectedUser);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Current user retrieved successfully'));
});

// @desc    Register a new user
// @route   POST /api/v1/users/register
// @access  Public
export const signUp = asyncHandler(async (req, res) => {
  const { status, role, email, password, fullName } = req.body;

  if ([email, password, fullName].some((field) => !field.trim())) {
    throw new ApiError(400, 'All required fields are missing');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const newUser = await User.create({
    email,
    password,
    role: role || 'customer',
    fullName,
    status: status || 'active',
  });

  const user = await User.findById(newUser._id);

  // send to email verification o the email address
  const { unHashedToken, hashedToken, tokenExpiry } =
    await user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  sendEmail({
    to: user.email,
    subject: 'Please verify your email',
    mailgenContent: emailVerificationMailgenContent(
      user.fullName,
      `${process.env.CLIENT_REDIRECT_URL}/verify-email/${unHashedToken}`
    ),
  }).catch((err) => {
    console.error('Failed to send verification email:', err.message);
  });

  const updatedUser = await User.findById(user._id).select(selectedUser);

  if (!updatedUser)
    throw new ApiError(404, 'user not updated when token generated!');

  return res
    .status(201)
    .json(new ApiResponse(201, updatedUser, 'User registered successfully'));
});

// @desc    Authenticate user and get token
// @route   POST /api/v1/users/login
// @access  Public
export const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({
    email,
    loginType: 'EMAIL_PASSWORD',
  }).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select(selectedUser);

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookiePayload)
    .cookie('refreshToken', refreshToken, cookiePayload)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User logged in successfully'
      )
    );
});

// @desc    Log out current user
// @route   POST /api/v1/users/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie('accessToken', cookiePayload)
    .clearCookie('refreshToken', cookiePayload)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

// @desc    Change current user's password
// @route   PUT /api/v1/users/change-password
// @access  Private
export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, 'Old password and new password are required');
  }

  if (
    [
      'guest-user@gmail.com',
      'useradmin@gmail.com',
      'admin-user@gmail.com',
    ].includes(req.user?.email)
  ) {
    throw new ApiError(404, 'Access denied for this user');
  }

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, 'User not found');

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid old password');
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

// @desc    resend verification email
// @route   POST api/v1//user/resend-verify-email
// @access  Private verify user
export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(400, 'User not found');

  if (user.isEmailVerified)
    throw new ApiError(400, 'Email is already verified!');

  // send to email verification o the email address
  const { unHashedToken, hashedToken, tokenExpiry } =
    await user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: 'Please verify your email',
    mailgenContent: emailVerificationMailgenContent(
      user.fullName,
      `${process.env.CLIENT_REDIRECT_URL}/verify-email/${unHashedToken}`
    ),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { unHashedToken },
        'Mail has been sent to your mail ID'
      )
    );
});

// @desc    verification email
// @route   GET api/v1//user/verify-email/:verificationToken
// @access  Public unVerify user
export const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;
  if (!verificationToken)
    throw new ApiError(400, 'Email verification token is missing');

  const hashedToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Token is invalid or expired');
  }

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  // Turn the email verified flag to `true`
  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, { isEmailVerified: true }, 'Email is verified'));
});

// @desc    reset forgotten password with used of reset token
// @route   POST api/v1//user/reset-password/:resetToken
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  const hashToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    forgotPasswordToken: hashToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(489, 'Token is invalid or expired');
  }

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password reset successfully'));
});

// @desc    forgot password request on email
// @route   POST /api/v1/user/forgot-password
// @access  Public
export const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User does not exists');
  }
  const { unHashedToken, hashedToken, tokenExpiry } =
    await user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  // Send mail with the password reset link.
  await sendEmail({
    to: user.email,
    subject: 'Password reset request',
    mailgenContent: forgotPasswordMailgenContent(
      user.fullName,
      `${process.env.CLIENT_REDIRECT_URL}/reset-password/${unHashedToken}`
    ),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { unHashedToken },
        'Password reset mail has been sent on your mail id'
      )
    );
});

// @desc    Assign role on user Admin
// @route   POST /api/v1/user/assign-role/:userId
// @access  Admin
export const assignRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }
  user.role = role;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Role changed for the user'));
});

// @desc    Update current user's profile
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { phoneNumber, fullName } = req.body;

  const user = await User.findById(req.user?._id).select(selectedUser);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.fullName = fullName || user.fullName;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User profile updated successfully'));
});

// @desc    Refresh access token
// @route   POST /api/v1/users/refresh-token
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized: Missing refresh token');
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.SECRET_TOKEN
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, 'Unauthorized: Invalid refresh token');
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, 'Unauthorized: Refresh token is revoked');
    }

    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const refreshedUser = await User.findById(user._id).select(selectedUser);

    return res
      .status(200)
      .cookie('accessToken', accessToken, cookiePayload)
      .cookie('refreshToken', newRefreshToken, cookiePayload)
      .json(
        new ApiResponse(
          200,
          { user: refreshedUser, accessToken },
          'Access token refreshed successfully'
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message);
  }
});

// @desc    Update user avatar
// @route   PUT /api/v1/users/avatar
// @access  Private
export const updateAvatar = asyncHandler(async (req, res) => {
  const filePath = req?.file?.path;
  if (!filePath) {
    throw new ApiError(400, 'No avatar file provided');
  }

  const avatar = await uploadSingleImg(filePath);
  if (!avatar) {
    throw new ApiError(500, 'Avatar upload failed');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar } },
    { new: true }
  ).select('-password -refreshToken');

  if (req?.user?.avatar) {
    const publicId = req?.user?.avatar?.split('/')[7]?.split('.')[0];
    await removeSingleImg(publicId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Avatar updated successfully'));
});

// @desc    Remove user avatar
// @route   DELETE /api/v1/users/avatar
// @access  Private
export const removeAvatar = asyncHandler(async (req, res) => {
  const publicId = req?.user?.avatar?.split('/')[7]?.split('.')[0];
  if (!publicId) {
    throw new ApiError(404, 'Avatar not found');
  }

  const removeResult = await removeSingleImg(publicId);
  if (!removeResult) {
    throw new ApiError(500, 'Failed to remove avatar from cloudinary');
  }

  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { avatar: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Avatar removed successfully'));
});

// @desc    Toggle product in user's favorites
// @route   POST /api/v1/users/favorites/:id
// @access  Private
export const toggleFavorite = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isFavorite = user.favorite.includes(id);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      [isFavorite ? '$pull' : '$addToSet']: { favorite: id },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { favorites: updatedUser.favorite },
        isFavorite ? 'Removed from favorites' : 'Added to favorites'
      )
    );
});

// @desc    Get all favorite products for current user
// @route   GET /api/v1/users/favorites
// @access  Private
export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorite');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.favorite,
        'Favorite products retrieved successfully'
      )
    );
});

export const handleSocialLogin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) throw new ApiError(404, 'User does not exist');

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return res
    .status(301)
    .cookie('accessToken', accessToken, cookiePayload)
    .cookie('refreshToken', refreshToken, cookiePayload)
    .redirect(
      `${process.env.CLIENT_REDIRECT_URL}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
});
