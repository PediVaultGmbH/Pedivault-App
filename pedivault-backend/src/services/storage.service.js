// src/services/storage.service.js
const fs   = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');

// Ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/**
 * Save uploaded file.
 * In dev: saves to local disk.
 * In prod: swap this for S3 upload (stub included below).
 */
async function saveFile(file, childId) {
  const ext      = path.extname(file.originalname) || '.bin';
  const filename = `${childId}_${uuidv4()}${ext}`;

  // ── Production: S3 ────────────────────────────────────────────────────────
  if (process.env.AWS_ACCESS_KEY_ID) {
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
    const s3 = new S3Client({ region: process.env.AWS_REGION });
    const key = `records/${filename}`;
    await s3.send(new PutObjectCommand({
      Bucket:      process.env.S3_BUCKET,
      Key:         key,
      Body:        file.buffer,
      ContentType: file.mimetype,
    }));
    return {
      key,
      url: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };
  }

  // ── Development: local disk ────────────────────────────────────────────────
  const dest = path.join(UPLOAD_DIR, filename);
  fs.writeFileSync(dest, file.buffer);
  return {
    key: filename,
    url: `/uploads/${filename}`,
  };
}

async function deleteFile(key) {
  if (process.env.AWS_ACCESS_KEY_ID) {
    const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
    const s3 = new S3Client({ region: process.env.AWS_REGION });
    await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
    return;
  }
  const filePath = path.join(UPLOAD_DIR, key);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

module.exports = { saveFile, deleteFile };
