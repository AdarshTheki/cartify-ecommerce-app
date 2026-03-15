import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import {
  generateText,
  generateTextToImage,
  getAllGeneratedAIPosts,
  toggleLikesCreation,
  resumeReviewer,
  deletedOpenaiById,
} from '../controllers/openai.controller.js';

const router = express.Router();

router.route('/posts').get(getAllGeneratedAIPosts);

router.use(verifyJWT());

router.route('/generate-text').post(generateText);
router.post('/generate-image', generateTextToImage);
router.post('/resume-reviewer', upload.single('pdfFile'), resumeReviewer);
router.post('/like/:slug', toggleLikesCreation);
router.delete('/post/:openaiId', deletedOpenaiById);

export default router;
