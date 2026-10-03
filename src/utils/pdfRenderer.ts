import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

export interface PageThumbnail {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Loads a PDF document and renders page thumbnails.
 */
export async function renderPdfThumbnails(
  file: File,
  maxPages = 50,
  scale = 0.4,
  onProgress?: (loaded: number, total: number) => void
): Promise<PageThumbnail[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
  });

  const pdf = await loadingTask.promise;
  const totalPages = Math.min(pdf.numPages, maxPages);
  const thumbnails: PageThumbnail[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await (page.render({
      canvasContext: ctx,
      viewport,
      canvas,
    } as any)).promise;

    thumbnails.push({
      pageNumber: i,
      dataUrl: canvas.toDataURL('image/jpeg', 0.8),
      width: viewport.width,
      height: viewport.height,
    });

    if (onProgress) {
      onProgress(i, totalPages);
    }
  }

  return thumbnails;
}

/**
 * Renders all pages of a PDF to high-resolution images (PNG or JPEG).
 */
export async function renderPdfToImages(
  file: File,
  format: 'png' | 'jpeg' = 'png',
  scale = 1.8,
  onProgress?: (current: number, total: number) => void
): Promise<{ pageNumber: number; blob: Blob; dataUrl: string }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
  });

  const pdf = await loadingTask.promise;
  const results: { pageNumber: number; blob: Blob; dataUrl: string }[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await (page.render({
      canvasContext: ctx,
      viewport,
      canvas,
    } as any)).promise;

    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = format === 'jpeg' ? 0.92 : undefined;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create blob from canvas'));
        },
        mime,
        quality
      );
    });

    results.push({
      pageNumber: i,
      blob,
      dataUrl: canvas.toDataURL(mime, quality),
    });

    if (onProgress) {
      onProgress(i, pdf.numPages);
    }
  }

  return results;
}
