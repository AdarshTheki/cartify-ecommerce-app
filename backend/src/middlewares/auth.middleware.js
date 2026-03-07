import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export const verifyJWT =
  (roles = []) =>
  async (req, res, next) => {
    try {
      const token =
        req?.cookies?.accessToken ||
        req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        throw new ApiError(401, 'No token access with cookies & Bearer');
      }

      const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);

      const user = await User.findById(decodedToken?._id).select(
        '-password -refreshToken'
      );

      if (!user) {
        throw new ApiError(401, 'Invalid Access Token: User not found');
      }

      if (roles && roles.length && !roles.includes(user.role)) {
        throw new ApiError(403, 'Permission not allowed to this Role');
      }

      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, error.message);
    }
  };
