import crypto from 'crypto';
import path from 'path';
import { Readable } from 'stream';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const BUCKET = process.env.S3_BUCKET;
const BASE_PREFIX = (process.env.S3_BASE_PREFIX || '').replace(/\/$/, '');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function buildKey(filename, dir = '') {
  const safeDir = dir?.replace(/^\/+|\/+$/g, '') || ''; // optional subfolder
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const nano = crypto.randomBytes(6).toString('hex');
  const parts = [BASE_PREFIX, safeDir, `${base}-${nano}${ext}`].filter(Boolean);
  return parts.join('/');
}

const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const dir = req.body.dir || ''; // optional folder in bucket
  const Key = buildKey(req.file.originalname, dir);

  const putCmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    // ACL: "private" // default is private
  });

  await s3.send(putCmd);

  return res.status(201).json({
    message: 'Uploaded',
    key: Key,
    contentType: req.file.mimetype,
    size: req.file.size,
  });
});

const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ error: 'No files uploaded' });

  const dir = req.body.dir || '';

  const results = await Promise.all(
    req.files.map(async (f) => {
      const Key = buildKey(f.originalname, dir);
      const cmd = new PutObjectCommand({
        Bucket: BUCKET,
        Key,
        Body: f.buffer,
        ContentType: f.mimetype,
      });
      await s3.send(cmd);
      return { key: Key, contentType: f.mimetype, size: f.size };
    })
  );

  return res.status(201).json({ message: 'Uploaded', files: results });
});

const listFiles = asyncHandler(async (req, res) => {
  const prefixParam = req.query.prefix || ''; // e.g., "invoices/2025"
  const Prefix = [BASE_PREFIX, prefixParam.replace(/^\/+/, '')]
    .filter(Boolean)
    .join('/');

  const cmd = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix,
    MaxKeys: 1000,
  });
  const data = await s3.send(cmd);

  const files = (data.Contents || []).map((o) => ({
    key: o.Key,
    size: o.Size,
    lastModified: o.LastModified,
    etag: o.ETag,
  }));

  return res.json({ count: files.length, files });
});

const deleteFile = asyncHandler(async (req, res) => {
  const { key } = req.params;
  if (!key) return res.status(400).json({ error: 'Key is required' });

  const cmd = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: decodeURIComponent(key),
  });
  await s3.send(cmd);
  return res.json({ message: 'Deleted', key: decodeURIComponent(key) });
});

const downloadFile = asyncHandler(async (req, res) => {
  const { key } = req.params;
  if (!key) return res.status(400).json({ error: 'Key is required' });

  const cmd = new GetObjectCommand({
    Bucket: BUCKET,
    Key: decodeURIComponent(key),
  });
  const data = await s3.send(cmd);

  // Set headers + stream body to client
  res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${encodeURIComponent(key.split('/').pop())}`
  );

  const bodyStream =
    data.Body instanceof Readable ? data.Body : Readable.from(data.Body);
  bodyStream.pipe(res);
});

const getPresignedUrl = asyncHandler(async (req, res) => {
  const { filename, dir = '', op = 'put' } = req.query;
  if (!filename) return res.status(400).json({ error: 'filename is required' });

  const Key = buildKey(filename, dir);
  const isPut = op === 'put';

  const cmd = isPut
    ? new PutObjectCommand({
        Bucket: BUCKET,
        Key,
        ContentType: req.query.contentType || 'application/octet-stream',
      })
    : new GetObjectCommand({ Bucket: BUCKET, Key });

  const url = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 }); // 5 minutes

  return res.json({ url, key: Key, op });
});

export {
  uploadSingle,
  uploadMultiple,
  listFiles,
  deleteFile,
  downloadFile,
  getPresignedUrl,
};
