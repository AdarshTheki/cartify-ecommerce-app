import express from 'express';
import https from 'https';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import passport from 'passport';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { initializeSocketIO } from './config/socket.js';
import { morganMiddleware } from './middlewares/logger.middleware.js';
import './config/passport.js';

// Import All Routing Files
import userRoute from './routes/user.route.js';
import productRoute from './routes/product.route.js';
import commentRoute from './routes/comment.route.js';
import categoryRoute from './routes/category.route.js';
import brandRoute from './routes/brand.route.js';
import cartRoute from './routes/cart.route.js';
import addressRoute from './routes/address.route.js';
import openaiRoute from './routes/openai.route.js';
import dashboardRoute from './routes/dashboard.route.js';
import messageRoute from './routes/message.route.js';
import chatRoute from './routes/chat.route.js';
import reviewRoute from './routes/review.route.js';
import orderRoute from './routes/order.route.js';
import s3BucketRoute from './routes/s3Bucket.route.js';
import imageRoute from './routes/image.route.js';
import healthRoute from './routes/health.route.js';
import { stripeWebhook } from './controllers/order.controller.js';

const app = express();

// ─── Ensure uploads/ directory exists ────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'public/temp');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

https.globalAgent = new https.Agent({ family: 4 });

app.post(
  '/api/v1/order/stripe-webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

const CORS = process.env?.CORS?.split(',');

app.use(cors({ origin: CORS, credentials: true }));

app.use(express.json({ limit: '16kb' }));

app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(express.static('public'));

app.use(cookieParser());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 200, // max 100 requests per windowMs
// });

// app.use(limiter);

app.use(morganMiddleware);

app.use(passport.initialize());

app.use(
  session({
    secret: process.env.SECRET_TOKEN,
    saveUninitialized: true,
    resave: true,
  })
);

// Connect and Serve the Socket.Io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS,
    credentials: true,
  },
});
app.set('io', io);
initializeSocketIO(io);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1/user', userRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1/comment', commentRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/brand', brandRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/address', addressRoute);
app.use('/api/v1/openai', openaiRoute);
app.use('/api/v1/dashboard', dashboardRoute);
app.use('/api/v1/chats', chatRoute);
app.use('/api/v1/messages', messageRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/s3-bucket', s3BucketRoute);
app.use('/api/v1/image', imageRoute);
app.use('/', healthRoute); // Health Check Route should be at the end to avoid route conflicts

export default server;
