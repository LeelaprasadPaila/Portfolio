#!/usr/bin/env node

/**
 * Compress images in the backend uploads folder.
 *
 * Usage:
 *   node backend/src/scripts/compressUploads.js
 *
 * This script scans `uploads/` and applies compression + optional resizing.
 * It overwrites images in-place (same file name).
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const QUALITY = 80;

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function compressFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!supportedExtensions.includes(ext)) return null;

  const originalStat = fs.statSync(filePath);
  const originalSize = originalStat.size;

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    const shouldResize = metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT;

    const pipeline = image
      .rotate()
      .resize({
        width: MAX_WIDTH,
        height: MAX_HEIGHT,
        fit: 'inside',
        withoutEnlargement: true,
      });

    if (ext === '.png') {
      pipeline.png({ quality: QUALITY, compressionLevel: 9, adaptiveFiltering: true });
    } else if (ext === '.webp') {
      pipeline.webp({ quality: QUALITY });
    } else {
      pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
    }

    await pipeline.toFile(filePath + '.tmp');
    const newStat = fs.statSync(filePath + '.tmp');
    const newSize = newStat.size;

    fs.renameSync(filePath + '.tmp', filePath);

    return { filePath, originalSize, newSize, resized: shouldResize };
  } catch (err) {
    if (fs.existsSync(filePath + '.tmp')) {
      fs.unlinkSync(filePath + '.tmp');
    }
    return { filePath, error: err.message };
  }
}

async function main() {
  console.log('🔍 Scanning uploads folder:', UPLOADS_DIR);

  if (!fs.existsSync(UPLOADS_DIR)) {
    console.error('✗ Uploads folder not found. Make sure it exists at:', UPLOADS_DIR);
    process.exit(1);
  }

  const allFiles = walkDir(UPLOADS_DIR).filter((file) => supportedExtensions.includes(path.extname(file).toLowerCase()));

  if (allFiles.length === 0) {
    console.log('✅ No images found to compress in uploads folder.');
    return;
  }

  console.log(`Found ${allFiles.length} images to process.`);

  const results = [];
  for (const file of allFiles) {
    process.stdout.write(`Compressing ${path.relative(process.cwd(), file)}... `);
    // eslint-disable-next-line no-await-in-loop
    const result = await compressFile(file);
    if (result && !result.error) {
      const saved = result.originalSize - result.newSize;
      const savedPct = ((saved / result.originalSize) * 100).toFixed(1);
      console.log(`done (${(result.originalSize / 1024).toFixed(1)} KB → ${(result.newSize / 1024).toFixed(1)} KB, -${savedPct}%)`);
      results.push(result);
    } else {
      console.log('failed');
      console.error('  >', result?.error || 'unknown error');
    }
  }

  const totalBefore = results.reduce((sum, r) => sum + (r.originalSize || 0), 0);
  const totalAfter = results.reduce((sum, r) => sum + (r.newSize || 0), 0);
  const totalSaved = totalBefore - totalAfter;

  console.log('\n✅ Compression complete');
  console.log(`   Total before: ${(totalBefore / 1024).toFixed(1)} KB`);
  console.log(`   Total after : ${(totalAfter / 1024).toFixed(1)} KB`);
  console.log(`   Saved       : ${(totalSaved / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error('✗ Unexpected error:', err);
  process.exit(1);
});
