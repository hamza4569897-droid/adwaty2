import JSZip from 'jszip';

export function formatBytes(bytes: number, language: 'ar' | 'en' = 'ar'): string {
  if (bytes === 0) return language === 'ar' ? '0 بايت' : '0 Bytes';
  const k = 1024;
  const sizesAr = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const sizesEn = ['Bytes', 'KB', 'MB', 'GB'];
  const sizes = language === 'ar' ? sizesAr : sizesEn;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${val} ${sizes[i]}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export function downloadArrayBuffer(
  buffer: ArrayBuffer | Uint8Array,
  filename: string,
  mimeType = 'application/pdf'
): void {
  const blob = new Blob([buffer as any], { type: mimeType });
  downloadBlob(blob, filename);
}

export async function downloadAsZip(
  files: { name: string; data: Uint8Array | Blob | string }[],
  zipFilename: string
): Promise<void> {
  const zip = new JSZip();
  for (const item of files) {
    zip.file(item.name, item.data);
  }
  const content = await zip.generateAsync({ type: 'blob' });
  downloadBlob(content, zipFilename);
}
