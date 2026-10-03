import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, FileImage, Archive } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FileDropzone } from '../common/FileDropzone';
import { ProgressBar } from '../common/ProgressBar';
import { renderPdfToImages } from '../../utils/pdfRenderer';
import { downloadBlob, downloadAsZip, formatBytes } from '../../utils/downloadHelper';

interface ExtractedImage {
  pageNumber: number;
  blob: Blob;
  dataUrl: string;
}

export const PdfToImagesTool: React.FC = () => {
  const { language, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (!files.length) return;
    setFile(files[0]);
    setErrorMessage(null);
    setImages([]);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(5);
    setErrorMessage(null);

    try {
      const rendered = await renderPdfToImages(file, format, 1.8, (curr, total) => {
        setProgress(Math.round((curr / total) * 100));
      });
      setImages(rendered);
    } catch {
      setErrorMessage(t.common.corruptedFileError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (img: ExtractedImage) => {
    if (!file) return;
    const base = file.name.replace(/\.pdf$/i, '');
    const ext = format === 'jpeg' ? 'jpg' : 'png';
    downloadBlob(img.blob, `${base}_page_${img.pageNumber}.${ext}`);
  };

  const handleDownloadZip = async () => {
    if (!file || images.length === 0) return;
    const base = file.name.replace(/\.pdf$/i, '');
    const ext = format === 'jpeg' ? 'jpg' : 'png';
    const zipFiles = images.map((img) => ({
      name: `${base}_page_${img.pageNumber}.${ext}`,
      data: img.blob,
    }));
    await downloadAsZip(zipFiles, `${base}_images.zip`);
  };

  const handleReset = () => {
    setFile(null);
    setImages([]);
    setErrorMessage(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone
          accept="application/pdf"
          multiple={false}
          onFilesSelected={handleFileSelected}
          title={language === 'ar' ? 'اختر ملف PDF لتحويله إلى صور' : 'Select PDF to Convert to Images'}
          subtitle={
            language === 'ar'
              ? 'حوّل صفحات ملف PDF إلى صور عالية الدقة PNG أو JPG'
              : 'Extract and render all PDF pages to high-resolution PNG or JPG images'
          }
          hint={t.common.dropzoneHintPdf}
          disabled={isProcessing}
        />
      ) : images.length > 0 ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t.common.success}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {language === 'ar'
                ? `تم استخراج ${images.length} صفحة بصيغة ${format.toUpperCase()}`
                : `Successfully extracted ${images.length} pages in ${format.toUpperCase()}`}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleDownloadZip}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
            >
              <Archive className="w-5 h-5" />
              <span>{t.common.downloadZip}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.common.processAnother}</span>
            </button>
          </div>

          {/* Grid of Extracted Images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
            {images.map((img) => (
              <div
                key={img.pageNumber}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2"
              >
                <div className="w-full h-44 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 rounded-xl p-1">
                  <img
                    src={img.dataUrl}
                    alt={`Page ${img.pageNumber}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="w-full flex items-center justify-between text-xs px-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    {language === 'ar' ? `ص ${img.pageNumber}` : `p. ${img.pageNumber}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(img)}
                    className="p-1 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
                    title={t.common.download}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-sm">
              <span className="font-semibold text-slate-900 dark:text-white">
                {file.name}
              </span>{' '}
              <span className="text-xs text-slate-500">
                ({formatBytes(file.size, language)})
              </span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-rose-600 transition-colors"
            >
              {language === 'ar' ? 'تغيير الملف' : 'Change file'}
            </button>
          </div>

          {/* Format Selection */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <label className="block text-sm font-bold text-slate-900 dark:text-white">
              {language === 'ar' ? 'صيغة الصور المستخرجة:' : 'Extracted Image Format:'}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('png')}
                className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all min-h-[48px] ${
                  format === 'png'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                PNG ({language === 'ar' ? 'أعلى دقة ووضوح' : 'Highest clarity'})
              </button>

              <button
                type="button"
                onClick={() => setFormat('jpeg')}
                className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all min-h-[48px] ${
                  format === 'jpeg'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                JPG ({language === 'ar' ? 'حجم ملف أصغر' : 'Smaller file size'})
              </button>
            </div>
          </div>

          {isProcessing && (
            <ProgressBar
              progress={progress}
              label={language === 'ar' ? 'جارٍ تحويل الصفحات إلى صور...' : 'Converting pages to images...'}
              sublabel={t.common.pleaseWait}
            />
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleConvert}
              disabled={isProcessing}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
            >
              <FileImage className="w-5 h-5" />
              <span>{language === 'ar' ? 'بدء تحويل PDF إلى صور' : 'Convert PDF to Images'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
