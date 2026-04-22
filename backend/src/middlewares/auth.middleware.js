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
        throw new ApiError(401, 'Unauthorized user, Please login !');
      }

      const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);

      const user = await User.findById(decodedToken?._id).select(
        '-password -refreshToken'
      );

      if (!user) {
        throw new ApiError(401, 'Invalid Access Token');
      }

      if (roles && roles.length && !roles.includes(user.role)) {
        throw new ApiError(403, 'Permission not allowed');
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
