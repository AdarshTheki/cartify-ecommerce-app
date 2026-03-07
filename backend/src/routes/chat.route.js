import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createGroupChat,
  createOrGetChat,
  deleteChat,
  getChats,
  getGroupChat,
  searchUsers,
  updateGroupChat,
} from '../controllers/chat.controller.js';

const router = Router();

router.use(verifyJWT());

router.route('/').get(getChats);
router.route('/chat/:receiverId').post(createOrGetChat);
router.route('/chat/:chatId').delete(deleteChat);
router.route('/users').get(searchUsers);
router.route('/group').post(createGroupChat);
router.route('/group/:chatId').get(getGroupChat).patch(updateGroupChat);

export default router;
