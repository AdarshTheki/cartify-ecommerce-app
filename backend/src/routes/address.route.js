import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createAddress,
  deleteAddress,
  getAllAddresses,
  updateAddress,
} from '../controllers/address.controller.js';

const router = Router();

router.use(verifyJWT());

router.route('/').get(getAllAddresses).post(createAddress);
router.route('/:id').patch(updateAddress).delete(deleteAddress);

export default router;
