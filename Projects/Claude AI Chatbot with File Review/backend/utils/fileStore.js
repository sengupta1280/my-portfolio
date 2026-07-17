import fs from 'fs';
import path from 'path';
import { config } from '../config/constants.js';

// Ensure upload directory exists
const ensureUploadDir = () => {
  if (!fs.existsSync(config.UPLOAD_DIR)) {
    fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });
  }
};

// Get metadata file path for a fileId
const metaPath = (fileId) => path.join(config.UPLOAD_DIR, `${fileId}.meta.json`);

// Save uploaded file and its metadata
export const saveFile = (fileId, filename, mimetype, buffer) => {
  ensureUploadDir();

  const filePath = path.join(config.UPLOAD_DIR, fileId);
  fs.writeFileSync(filePath, buffer);

  const meta = {
    fileId,
    originalName: filename,
    mimeType: mimetype,
    size: buffer.length,
    uploadedAt: new Date().toISOString(),
  };
  fs.writeFileSync(metaPath(fileId), JSON.stringify(meta));

  return meta;
};

// Get file metadata by ID (includes MIME type and original name)
export const getFile = (fileId) => {
  ensureUploadDir();
  const filePath = path.join(config.UPLOAD_DIR, fileId);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const stats = fs.statSync(filePath);
  let meta = {};

  // Recover metadata from the sidecar file
  const mp = metaPath(fileId);
  if (fs.existsSync(mp)) {
    try {
      meta = JSON.parse(fs.readFileSync(mp, 'utf-8'));
    } catch {
      // ignore corrupt meta files
    }
  }

  return {
    fileId,
    path: filePath,
    originalName: meta.originalName || fileId,
    mimeType: meta.mimeType || 'application/octet-stream',
    size: stats.size,
    uploadedAt: meta.uploadedAt || stats.birthtime.toISOString(),
  };
};

// Get file content as raw buffer
export const getFileContent = (fileId) => {
  const filePath = path.join(config.UPLOAD_DIR, fileId);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath);
};

// Delete file and its metadata sidecar
export const deleteFile = (fileId) => {
  const filePath = path.join(config.UPLOAD_DIR, fileId);
  const mp = metaPath(fileId);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  if (fs.existsSync(mp)) {
    fs.unlinkSync(mp);
  }

  return true;
};

// List all files in upload directory
export const listFiles = () => {
  ensureUploadDir();

  return fs.readdirSync(config.UPLOAD_DIR)
    .filter((name) => !name.endsWith('.meta.json'))
    .map((fileId) => getFile(fileId))
    .filter(Boolean);
};
