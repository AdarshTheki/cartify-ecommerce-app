import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import {
  getCurrentUser,
  getFavorites,
  logout,
  refreshToken,
  removeAvatar,
  signIn,
  signUp,
  toggleFavorite,
  updateAvatar,
  updateUserProfile,
  handleSocialLogin,
  changeCurrentPassword,
  resendVerificationEmail,
  verifyEmail,
  forgotPasswordRequest,
  assignRole,
  updateUserByAdmin,
  getUserIdByAdmin,
  deleteUserByAdmin,
  createUserByAdmin,
  getAllUserByAdmin,
  resetPassword,
} from '../controllers/user.controller.js';
import passport from 'passport';

const router = Router();

// SOS
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
  (req, res) => res.send('redirecting to google...')
);

router.get(
  '/github',
  passport.authenticate('github', { scope: ['profile', 'email'] }),
  (req, res) => res.send('redirecting to github...')
);

router
  .route('/google/callback')
  .get(passport.authenticate('google'), handleSocialLogin);

router
  .route('/github/callback')
  .get(passport.authenticate('github'), handleSocialLogin);

// Unauthenticated routes
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/refresh-token', refreshToken);

// User Permissions
router.route('/admin').get(verifyJWT(), getAllUserByAdmin);
router.route('/admin').post(verifyJWT(['admin']), createUserByAdmin);
router
  .route('/admin/:id')
  .get(verifyJWT(), getUserIdByAdmin)
  .patch(verifyJWT(['admin']), updateUserByAdmin)
  .delete(verifyJWT(['admin']), deleteUserByAdmin);

router.route('/resend-verify-email').get(verifyJWT(), resendVerificationEmail);
router.route('/verify-email/:verificationToken').get(verifyEmail);
router.route('/change-password').post(verifyJWT(), changeCurrentPassword);
router.route('/reset-password/:resetToken').post(resetPassword);
router.route('/forgot-password').post(forgotPasswordRequest);
router.route('/assign-role/:userId').post(verifyJWT(['admin'], assignRole));

// Authenticated routes
router.use(verifyJWT());

router.get('/current-user', getCurrentUser);
router.post('/logout', logout);
router.patch('/update', updateUserProfile);

router
  .route('/avatar')
  .post(upload.single('avatar'), updateAvatar)
  .delete(removeAvatar);

router.route('/favorite').get(getFavorites);
router.route('/favorite/:id').patch(toggleFavorite);

export default router;
