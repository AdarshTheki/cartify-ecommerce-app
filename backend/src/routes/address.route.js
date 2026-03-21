import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createAddress,
  deleteAddress,
  getAddress,
  getUserAddresses,
  updateAddress,
} from '../controllers/address.controller.js';

const router = Router();

router.use(verifyJWT());

router.route('/').get(getUserAddresses).post(createAddress);
router.route('/:id').get(getAddress).patch(updateAddress).delete(deleteAddress);

export default router;
