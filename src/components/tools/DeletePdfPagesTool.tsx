import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FileDropzone } from '../common/FileDropzone';
import { ProgressBar } from '../common/ProgressBar';
import { renderPdfThumbnails, PageThumbnail } from '../../utils/pdfRenderer';
import { deletePDFPages } from '../../utils/pdfUtils';
import { downloadArrayBuffer, formatBytes } from '../../utils/downloadHelper';

export const DeletePdfPagesTool: React.FC = () => {
  const { language, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
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
      setSelectedPages(new Set());
    } catch {
      setErrorMessage(t.common.corruptedFileError);
      setFile(null);
    } finally {
      setIsRendering(false);
    }
  };

  const togglePageSelection = (pageNum: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageNum)) {
        next.delete(pageNum);
      } else {
        next.add(pageNum);
      }
      return next;
    });
  };

  const handleDelete = async () => {
    if (!file || selectedPages.size === 0) return;
    if (selectedPages.size >= thumbnails.length) {
      setErrorMessage(
        language === 'ar'
          ? 'لا يمكن حذف جميع صفحات الملف! يجب الإبقاء على صفحة واحدة على الأقل.'
          : 'Cannot delete all pages! At least one page must remain.'
      );
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setErrorMessage(null);

    try {
      const pagesToDelete = Array.from(selectedPages);
      const cleanedBytes = await deletePDFPages(file, pagesToDelete, (p) => setProgress(p));
      const baseName = file.name.replace(/\.pdf$/i, '');
      setResult({
        data: cleanedBytes,
        filename: `${baseName}_cleaned.pdf`,
        size: cleanedBytes.byteLength,
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
    setSelectedPages(new Set());
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
            {language === 'ar' ? 'تم حذف الصفحات وحفظ الملف المنقح:' : 'Pages deleted and cleaned document saved:'}{' '}
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
          title={language === 'ar' ? 'اختر ملف PDF لحذف صفحات منه' : 'Select PDF File to Delete Pages'}
          subtitle={
            language === 'ar'
              ? 'انقر على الصفحات غير المرغوبة لتحديدها وحذفها فوراً'
              : 'Click on unwanted pages to mark and delete them instantly'
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
          {/* Header bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-sm">
              <span className="font-semibold text-slate-900 dark:text-white">
                {file.name}
              </span>{' '}
              <span className="text-xs text-slate-500">
                ({thumbnails.length} {language === 'ar' ? 'صفحة' : 'pages'})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {language === 'ar'
                  ? `تم تحديد ${selectedPages.size} صفحة للحذف`
                  : `${selectedPages.size} pages selected for deletion`}
              </span>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-rose-600 px-2 py-1 transition-colors"
              >
                {language === 'ar' ? 'تغيير الملف' : 'Change file'}
              </button>
            </div>
          </div>

          {/* Grid of Pages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {thumbnails.map((thumb) => {
              const isSelected = selectedPages.has(thumb.pageNumber);
              return (
                <div
                  key={thumb.pageNumber}
                  onClick={() => togglePageSelection(thumb.pageNumber)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      togglePageSelection(thumb.pageNumber);
                    }
                  }}
                  className={`relative cursor-pointer p-3 rounded-2xl border-2 transition-all select-none ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  {/* Delete indicator badge */}
                  {isSelected && (
                    <div className="absolute top-2 end-2 z-10 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                      <Trash2 className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="w-full h-44 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 rounded-xl p-1 relative">
                    <img
                      src={thumb.dataUrl}
                      alt={`Page ${thumb.pageNumber}`}
                      className={`max-h-full max-w-full object-contain transition-opacity ${
                        isSelected ? 'opacity-40 grayscale' : 'opacity-100'
                      }`}
                    />
                  </div>

                  <div className="w-full flex items-center justify-between text-xs px-1 pt-2">
                    <span
                      className={`font-semibold ${
                        isSelected ? 'text-rose-600' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {language === 'ar' ? `صفحة ${thumb.pageNumber}` : `Page ${thumb.pageNumber}`}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isSelected
                        ? language === 'ar' ? 'سيتم حذفها' : 'Delete'
                        : language === 'ar' ? 'إبقاء' : 'Keep'}
                    </span>
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
              onClick={handleDelete}
              disabled={isProcessing || selectedPages.size === 0}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm shadow-rose-600/20 active:scale-98 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              <span>
                {language === 'ar'
                  ? `حذف ${selectedPages.size} صفحات محددة`
                  : `Delete ${selectedPages.size} Selected Pages`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
