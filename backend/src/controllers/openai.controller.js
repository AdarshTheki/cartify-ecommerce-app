import { isValidObjectId } from 'mongoose';
import OpenAI from 'openai';
import axios from 'axios';
import FormData from 'form-data';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import fs from 'fs';

import { AIModel } from '../models/ai.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cloudinary } from '../utils/cloudinary.js';

// gen_remove:
// background_removal

// review prompt
// `Generate a e-commerce product review under 200 characters for this prompt "${prompt}"`;

// description prompt
// `Generate a e-commerce product description under ${size ? parseInt(size) : 500} characters for a ${category} product with the title "${title}" and the brand "${brand}"`;

// `Review the following resume and provide a constructive feedback on its strengths, weaknesses and areas for improvement. Resume content:\n\ ${pdfData.text}`;

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

// @desc    Generate text using OpenAI
// @route   POST /api/v1/openai/generate-text
// @access  Private
export const generateText = asyncHandler(async (req, res) => {
  const { prompt, userText } = req.body;

  if (!prompt) {
    throw new ApiError(400, 'Prompt & User Text is required');
  }

  const response = await openai.chat.completions.create({
    model: 'gemini-2.0-flash',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const aiResponse = response.choices[0].message.content;

  const newAIModel = await AIModel.create({
    response: aiResponse,
    createdBy: req.user._id,
    model: 'generate-text',
    publish: true,
    prompt: userText || prompt,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newAIModel, 'Text generated successfully'));
});

// @desc    Generate image from text using OpenAI
// @route   POST /api/v1/openai/generate-image
// @access  Private
export const generateTextToImage = asyncHandler(async (req, res) => {
  const { prompt, userText } = req.body;

  if (!prompt || !userText) {
    throw new ApiError(400, 'Prompt is required to generate an image');
  }

  const formData = new FormData();
  formData.append('prompt', prompt);

  const clipdropRes = await axios.post(
    'https://clipdrop-api.co/text-to-image/v1',
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        'x-api-key': process.env.CLIPDROP_API_KEY,
      },
      responseType: 'arraybuffer',
    }
  );

  const base64Image = `data:image/png;base64,${Buffer.from(clipdropRes.data).toString('base64')}`;

  const cloudinaryUpload = await cloudinary.uploader.upload(base64Image);

  if (!cloudinaryUpload.secure_url)
    throw new ApiError(404, 'image upload failed');

  const newAIModel = await AIModel.create({
    response: cloudinaryUpload.secure_url,
    createdBy: req.user._id,
    model: 'text-to-image',
    publish: true,
    prompt: userText,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newAIModel, 'Image generated successfully'));
});

// @desc    Review Resume AI generated post
// @route   POST /api/v1/openai/resume-reviewer
// @access  Private
export const resumeReviewer = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Resume PDF file is required');

  if (req.file.size > 5 * 1024 * 1024) {
    fs.unlinkSync(req.file.path); // clean up
    throw new ApiError(400, 'Resume must be under 5MB');
  }

  let pdfBuffer;
  let parsed;

  try {
    pdfBuffer = fs.readFileSync(req.file.path);
    parsed = await pdf(pdfBuffer);
  } finally {
    fs.unlinkSync(req.file.path);
  }

  if (parsed?.text?.length < 20) {
    throw new ApiError(404, 'invalid Text pdf parse');
  }

  const prompt = `
    You are a professional career coach and resume reviewer. 
    Analyze the uploaded resume (PDF) carefully and provide detailed feedback.
    Inputs: 
    - Resume File: ${parsed.text}  
    Output Format:
    - Strengths ✅  
    - Weaknesses ⚠️  
    - Recommendations 📌  
`;

  const response = await openai.chat.completions.create({
    model: 'gemini-2.0-flash',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });
  const feedback = response.choices[0].message.content;

  const newAIModel = await AIModel.create({
    response: feedback,
    prompt: 'Create a professional career coach and resume reviewer',
    createdBy: req.user._id,
    model: 'generate-text',
    publish: true,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, newAIModel, 'Review resume generated successfully')
    );
});

// @desc    Toggle like on an AI generated post
// @route   POST /api/v1/openai/toggle-like/:aiPostId
// @access  Private
export const toggleLikesCreation = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const { slug } = req.params;

  const aiPost = await AIModel.findById(slug);
  if (!aiPost) {
    throw new ApiError(404, 'AI post not found');
  }

  const isLiked = aiPost.likes.includes(userId);

  const updatedPost = await AIModel.findByIdAndUpdate(
    aiPost._id,
    isLiked ? { $pull: { likes: userId } } : { $push: { likes: userId } },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalLikes: updatedPost.likes.length },
        `User has ${isLiked ? 'unliked' : 'liked'} the post.`
      )
    );
});

// @desc    Delete an AI generated post
// @route   DELETE /api/v1/openai/post/:openaiId
// @access  Private
export const deletedOpenaiById = asyncHandler(async (req, res) => {
  const { openaiId } = req.params;
  if (!isValidObjectId(openaiId)) throw new ApiError('Openai Id is invalid');

  if (
    ['adminuser@gmail.com', 'guest-user@gmail.com'].includes(req.user.email)
  ) {
    throw new ApiError(404, 'This user not deleted of any that account posts');
  }

  const post = await AIModel.findOneAndDelete({
    createdBy: req.user._id,
    _id: openaiId,
  });

  if (!post) throw new ApiError(404, 'Not found on databases');

  res
    .status(200)
    .json(new ApiResponse(200, post, 'Deleted this post successfully'));
});

// @desc    Get user's generated AI posts
// @route   GET /api/v1/openai/user-generations
// @access  Private
export const getUserGenerate = asyncHandler(async (req, res) => {
  const posts = await AIModel.find({ createdBy: req.user._id })
    .populate('createdBy', 'email fullName')
    .sort({
      createdAt: -1,
    });
  return res
    .status(200)
    .json(
      new ApiResponse(200, posts, 'User generated posts retrieved successfully')
    );
});
