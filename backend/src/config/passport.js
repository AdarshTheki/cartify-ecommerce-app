import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GithubStrategy } from 'passport-github2';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';

try {
  passport.serializeUser((user, next) => {
    next(null, user._id);
  });

  passport.deserializeUser(async (id, next) => {
    try {
      const user = await User.findById(id);
      if (user) next(null, user);
      else next(new ApiError(400, 'User not found'), null);
    } catch (error) {
      next(new ApiError(500, 'Internal error ' + error.message), null);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_REDIRECT_URL}/api/v1/user/google/callback`,
      },
      async (_, __, profile, next) => {
        const user = await User.findOne({ email: profile._json.email });
        if (user) {
          next(null, user);
        } else {
          // create new user
          const createUser = await User.create({
            email: profile._json.email,
            password: profile._json.sub,
            avatar: profile._json.picture,
            fullName: profile._json.email?.split('@')[0],
            isEmailVerify: true,
            role: 'customer',
            loginType: 'GOOGLE',
          });
          if (createUser) next(null, createUser);
          else
            next(new ApiError(500, 'Error while registering the user'), null);
        }
      }
    )
  );

  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_REDIRECT_URL}/api/v1/user/github/callback`,
      },
      async (_, __, profile, next) => {
        const user = await User.findOne({ email: profile._json.email });
        if (user) {
          next(null, user);
        } else {
          if (!profile._json.email) {
            next(
              new ApiError(
                400,
                'User does not have a public email associated with their account. Please try another login method'
              ),
              null
            );
          } else {
            const userNameExist = await User.findOne({
              fullName: profile?.username,
            });
            const createUser = await User.create({
              fullName: userNameExist
                ? profile._json.email.split('@')[0]
                : profile.username,
              email: profile._json.email,
              password: profile._json.node_id,
              isEmailVerify: true,
              role: 'customer',
              avatar: profile._json.avatar_url,
              loginType: 'GITHUB',
            });
            if (createUser) next(null, createUser);
            else
              next(
                new ApiError(500, 'Error while registering the user"'),
                null
              );
          }
        }
      }
    )
  );
} catch (error) {
  console.error('PASSPORT ERROR: ', error.message);
}
