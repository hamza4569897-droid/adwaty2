export interface ImageDimensions {
  width: number;
  height: number;
}

export async function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

export interface CompressResult {
  blob: Blob;
  dataUrl: string;
  originalSize: number;
  newSize: number;
  savedPercent: number;
  width: number;
  height: number;
}

/**
 * Compresses an image using HTML5 Canvas with quality level (0.1 - 1.0).
 */
export async function compressImage(
  file: File,
  quality = 0.75,
  maxWidth = 3840,
  maxHeight = 3840
): Promise<CompressResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Determine mime type: if PNG and quality < 0.9, use JPEG or WEBP to get real compression
      let mimeType = file.type;
      if (!mimeType || mimeType === 'image/png') {
        mimeType = 'image/jpeg';
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'));
            return;
          }

          const originalSize = file.size;
          const newSize = blob.size;
          const savedPercent = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

          resolve({
            blob,
            dataUrl: canvas.toDataURL(mimeType, quality),
            originalSize,
            newSize,
            savedPercent,
            width,
            height,
          });
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Corrupted or unsupported image'));
    };

    img.src = url;
  });
}

/**
 * Resizes an image by explicit dimensions or percentage.
 */
export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  format: 'jpeg' | 'png' | 'webp' = 'jpeg',
  quality = 0.92
): Promise<CompressResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mime = `image/${format}`;
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Resize failed'));
            return;
          }

          resolve({
            blob,
            dataUrl: canvas.toDataURL(mime, quality),
            originalSize: file.size,
            newSize: blob.size,
            savedPercent: Math.round(((file.size - blob.size) / file.size) * 100),
            width: targetWidth,
            height: targetHeight,
          });
        },
        mime,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for resize'));
    };

    img.src = url;
  });
}

/**
 * Converts image format (JPG, PNG, WebP).
 */
export async function convertImageFormat(
  file: File,
  targetFormat: 'jpeg' | 'png' | 'webp',
  quality = 0.92
): Promise<{ blob: Blob; dataUrl: string; filename: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // If converting transparent image to JPEG, fill white background
      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mime = `image/${targetFormat}`;
      const ext = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const filename = `${baseName}.${ext}`;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Format conversion failed'));
            return;
          }
          resolve({
            blob,
            dataUrl: canvas.toDataURL(mime, quality),
            filename,
          });
        },
        mime,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for conversion'));
    };

    img.src = url;
  });
}
