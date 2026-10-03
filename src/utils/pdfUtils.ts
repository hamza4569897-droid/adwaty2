import { PDFDocument, degrees, PageSizes } from 'pdf-lib';

/**
 * Merges multiple PDF files in order into a single PDF document.
 */
export async function mergePDFs(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileBuffer = await file.arrayBuffer();

    let doc: PDFDocument;
    try {
      doc = await PDFDocument.load(fileBuffer, { ignoreEncryption: false });
    } catch (e: any) {
      if (e?.message?.toLowerCase().includes('encrypt')) {
        throw new Error('ENCRYPTED_FILE');
      }
      throw new Error('CORRUPTED_FILE');
    }

    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));

    if (onProgress) {
      onProgress(Math.round(((i + 1) / files.length) * 100));
    }
  }

  return await mergedPdf.save();
}

/**
 * Parses user range string like "1-3, 5, 8-10" into 1-based page numbers.
 */
export function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const pagesSet = new Set<number>();
  const parts = rangeStr.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let p = min; p <= max; p++) {
          pagesSet.add(p);
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        pagesSet.add(page);
      }
    }
  }

  return Array.from(pagesSet).sort((a, b) => a - b);
}

/**
 * Splits a PDF by extracting specified page ranges into a single new PDF document.
 */
export async function splitPDFByRange(
  file: File,
  pageNumbers: number[],
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const fileBuffer = await file.arrayBuffer();
  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(fileBuffer);
  } catch (e: any) {
    if (e?.message?.toLowerCase().includes('encrypt')) throw new Error('ENCRYPTED_FILE');
    throw new Error('CORRUPTED_FILE');
  }

  const newDoc = await PDFDocument.create();
  const total = pageNumbers.length;

  for (let i = 0; i < pageNumbers.length; i++) {
    const pageIdx = pageNumbers[i] - 1;
    if (pageIdx >= 0 && pageIdx < doc.getPageCount()) {
      const [copiedPage] = await newDoc.copyPages(doc, [pageIdx]);
      newDoc.addPage(copiedPage);
    }
    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100));
    }
  }

  return await newDoc.save();
}

/**
 * Splits every page of a PDF into individual PDF documents.
 */
export async function splitAllPages(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<{ filename: string; data: Uint8Array }[]> {
  const fileBuffer = await file.arrayBuffer();
  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(fileBuffer);
  } catch (e: any) {
    if (e?.message?.toLowerCase().includes('encrypt')) throw new Error('ENCRYPTED_FILE');
    throw new Error('CORRUPTED_FILE');
  }

  const pageCount = doc.getPageCount();
  const results: { filename: string; data: Uint8Array }[] = [];
  const baseName = file.name.replace(/\.pdf$/i, '');

  for (let i = 0; i < pageCount; i++) {
    const singleDoc = await PDFDocument.create();
    const [copiedPage] = await singleDoc.copyPages(doc, [i]);
    singleDoc.addPage(copiedPage);
    const data = await singleDoc.save();
    results.push({
      filename: `${baseName}_page_${i + 1}.pdf`,
      data,
    });
    if (onProgress) {
      onProgress(i + 1, pageCount);
    }
  }

  return results;
}

/**
 * Rotates specific pages of a PDF file.
 */
export async function rotatePDFPages(
  file: File,
  rotations: Record<number, number>, // pageNumber (1-based) -> degree delta (e.g. 90, 180, 270)
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const fileBuffer = await file.arrayBuffer();
  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(fileBuffer);
  } catch (e: any) {
    if (e?.message?.toLowerCase().includes('encrypt')) throw new Error('ENCRYPTED_FILE');
    throw new Error('CORRUPTED_FILE');
  }

  const pageCount = doc.getPageCount();
  for (let i = 1; i <= pageCount; i++) {
    const delta = rotations[i] || 0;
    if (delta !== 0) {
      const page = doc.getPage(i - 1);
      const currentAngle = page.getRotation().angle;
      page.setRotation(degrees((currentAngle + delta) % 360));
    }
    if (onProgress) {
      onProgress(Math.round((i / pageCount) * 100));
    }
  }

  return await doc.save();
}

/**
 * Deletes selected pages from a PDF document.
 */
export async function deletePDFPages(
  file: File,
  pagesToDelete: number[], // 1-based
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const fileBuffer = await file.arrayBuffer();
  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(fileBuffer);
  } catch (e: any) {
    if (e?.message?.toLowerCase().includes('encrypt')) throw new Error('ENCRYPTED_FILE');
    throw new Error('CORRUPTED_FILE');
  }

  const pageCount = doc.getPageCount();
  const deleteSet = new Set(pagesToDelete);

  const keepIndices: number[] = [];
  for (let i = 1; i <= pageCount; i++) {
    if (!deleteSet.has(i)) {
      keepIndices.push(i - 1);
    }
  }

  if (keepIndices.length === 0) {
    throw new Error('CANNOT_DELETE_ALL_PAGES');
  }

  const newDoc = await PDFDocument.create();
  const total = keepIndices.length;

  for (let i = 0; i < keepIndices.length; i++) {
    const [copiedPage] = await newDoc.copyPages(doc, [keepIndices[i]]);
    newDoc.addPage(copiedPage);
    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100));
    }
  }

  return await newDoc.save();
}

/**
 * Converts multiple images to a single PDF document.
 */
export async function imagesToPDF(
  images: { file: File }[],
  options: {
    pageSize: 'a4' | 'fit';
    orientation: 'portrait' | 'landscape' | 'auto';
    margin: 'none' | 'small' | 'normal';
  },
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const marginPt = options.margin === 'none' ? 0 : options.margin === 'small' ? 20 : 40;

  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    const imageBytes = await item.file.arrayBuffer();

    let embeddedImage;
    const isPng = item.file.type.includes('png');

    // If WebP, convert to PNG in-memory via canvas before embedding
    if (item.file.type.includes('webp')) {
      const convertedPngBytes = await webpToPngBytes(item.file);
      embeddedImage = await pdfDoc.embedPng(convertedPngBytes);
    } else if (isPng) {
      try {
        embeddedImage = await pdfDoc.embedPng(imageBytes);
      } catch {
        embeddedImage = await pdfDoc.embedJpg(imageBytes);
      }
    } else {
      try {
        embeddedImage = await pdfDoc.embedJpg(imageBytes);
      } catch {
        embeddedImage = await pdfDoc.embedPng(imageBytes);
      }
    }

    const { width: imgWidth, height: imgHeight } = embeddedImage;

    let pageWidth: number;
    let pageHeight: number;

    if (options.pageSize === 'fit') {
      pageWidth = imgWidth + marginPt * 2;
      pageHeight = imgHeight + marginPt * 2;
    } else {
      // A4 default [595.28, 841.89]
      let isLandscape = false;
      if (options.orientation === 'landscape') {
        isLandscape = true;
      } else if (options.orientation === 'auto') {
        isLandscape = imgWidth > imgHeight;
      }

      if (isLandscape) {
        pageWidth = PageSizes.A4[1];
        pageHeight = PageSizes.A4[0];
      } else {
        pageWidth = PageSizes.A4[0];
        pageHeight = PageSizes.A4[1];
      }
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Calculate image placement maintaining aspect ratio
    const availableWidth = Math.max(10, pageWidth - marginPt * 2);
    const availableHeight = Math.max(10, pageHeight - marginPt * 2);

    const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });

    if (onProgress) {
      onProgress(Math.round(((i + 1) / images.length) * 100));
    }
  }

  return await pdfDoc.save();
}

/**
 * Converts WebP to PNG Uint8Array using browser Canvas.
 */
async function webpToPngBytes(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to convert WebP'));
          return;
        }
        blob.arrayBuffer().then(resolve).catch(reject);
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load WebP image'));
    };
    img.src = url;
  });
}
