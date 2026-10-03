import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, RotateCw, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FileDropzone } from '../common/FileDropzone';
import { ProgressBar } from '../common/ProgressBar';
import { renderPdfThumbnails, PageThumbnail } from '../../utils/pdfRenderer';
import { rotatePDFPages } from '../../utils/pdfUtils';
import { downloadArrayBuffer, formatBytes } from '../../utils/downloadHelper';

export const RotatePdfTool: React.FC = () => {
  const { language, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [isRendering, setIsRendering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ data: Uint8Array; filename: string; size: number } | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (!files.length) return;
    const selected = files[0];
    setFile(selected);
    setErrorMessage(null);
    setIsRendering(true);
    setProgress(10);

    try {
      const thumbs = await renderPdfThumbnails(selected, 60, 0.35, (curr, total) => {
        setProgress(Math.round((curr / total) * 100));
      });
      setThumbnails(thumbs);
      setRotations({});
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes('password') || err?.name === 'PasswordException') {
        setErrorMessage(t.common.encryptedPdfError);
      } else {
        setErrorMessage(t.common.corruptedFileError);
      }
      setFile(null);
    } finally {
      setIsRendering(false);
    }
  };

  const rotatePage = (pageNum: number, degreesDelta: number) => {
    setRotations((prev) => {
      const current = prev[pageNum] || 0;
      const next = (current + degreesDelta + 360) % 360;
      return { ...prev, [pageNum]: next };
    });
  };

  const rotateAll = (degreesDelta: number) => {
    setRotations((prev) => {
      const updated: Record<number, number> = {};
      thumbnails.forEach((t) => {
        const current = prev[t.pageNumber] || 0;
        updated[t.pageNumber] = (current + degreesDelta + 360) % 360;
      });
      return updated;
    });
  };

  const handleSave = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);
    setErrorMessage(null);

    try {
      const rotatedBytes = await rotatePDFPages(file, rotations, (p) => setProgress(p));
      const baseName = file.name.replace(/\.pdf$/i, '');
      setResult({
        data: rotatedBytes,
        filename: `${baseName}_rotated.pdf`,
        size: rotatedBytes.byteLength,
      });
      setProgress(100);
    } catch {
      setErrorMessage(t.common.corruptedFileError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadArrayBuffer(result.data, result.filename, 'application/pdf');
    }
  };

  const handleReset = () => {
    setFile(null);
    setThumbnails([]);
    setRotations({});
    setResult(null);
    setErrorMessage(null);
    setProgress(0);
  };

  if (result) {
    return (
      <div className="max-w-xl mx-auto py-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {t.common.success}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {language === 'ar' ? 'تم حفظ اتجاه الصفحات الجديد بنجاح:' : 'New page orientation saved successfully:'}{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {result.filename}
            </span>
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {formatBytes(result.size, language)}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
          >
            <Download className="w-5 h-5" />
            <span>{t.common.download}</span>
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone
          accept="application/pdf"
          multiple={false}
          onFilesSelected={handleFileSelected}
          title={language === 'ar' ? 'اختر ملف PDF لتدوير صفحاته' : 'Select PDF File to Rotate'}
          subtitle={
            language === 'ar'
              ? 'اسحب ملف PDF إلى هنا لعرض ومعاينة الصفحات وتدويرها'
              : 'Drag & drop a PDF file here to preview and rotate pages'
          }
          hint={t.common.dropzoneHintPdf}
          disabled={isRendering}
        />
      ) : isRendering ? (
        <ProgressBar
          progress={progress}
          label={language === 'ar' ? 'جارٍ توليد المعاينة للصفحات...' : 'Generating page previews...'}
          sublabel={t.common.pleaseWait}
        />
      ) : (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-sm">
              <span className="font-semibold text-slate-900 dark:text-white">
                {file.name}
              </span>{' '}
              <span className="text-xs text-slate-500">
                ({thumbnails.length} {language === 'ar' ? 'صفحة' : 'pages'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => rotateAll(90)}
                className="px-3 py-1.5 min-h-[36px] rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تدوير الكل 90°' : 'Rotate All 90°'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-rose-600 px-2 py-1 transition-colors"
              >
                {language === 'ar' ? 'تغيير الملف' : 'Change file'}
              </button>
            </div>
          </div>

          {/* Grid of Page Thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {thumbnails.map((thumb) => {
              const rot = rotations[thumb.pageNumber] || 0;
              return (
                <div
                  key={thumb.pageNumber}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2"
                >
                  <div className="w-full h-44 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 rounded-xl p-1">
                    <img
                      src={thumb.dataUrl}
                      alt={`Page ${thumb.pageNumber}`}
                      className="max-h-full max-w-full object-contain transition-transform duration-200 shadow-xs"
                      style={{ transform: `rotate(${rot}deg)` }}
                    />
                  </div>

                  <div className="w-full flex items-center justify-between text-xs px-1">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      {language === 'ar' ? `ص ${thumb.pageNumber}` : `p. ${thumb.pageNumber}`}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => rotatePage(thumb.pageNumber, -90)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors"
                        title="Rotate left"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => rotatePage(thumb.pageNumber, 90)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors"
                        title="Rotate right"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {isProcessing && (
            <ProgressBar
              progress={progress}
              label={t.common.processing}
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
              onClick={handleSave}
              disabled={isProcessing}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
            >
              <RotateCw className="w-5 h-5" />
              <span>{language === 'ar' ? 'حفظ اتجاه الصفحات وتحميل PDF' : 'Save & Download Rotated PDF'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
