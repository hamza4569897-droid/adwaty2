import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, Images } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FileDropzone } from '../common/FileDropzone';
import { FileList, ListedFile } from '../common/FileList';
import { ProgressBar } from '../common/ProgressBar';
import { imagesToPDF } from '../../utils/pdfUtils';
import { downloadArrayBuffer, formatBytes } from '../../utils/downloadHelper';

export const ImagesToPdfTool: React.FC = () => {
  const { language, t } = useApp();
  const [files, setFiles] = useState<ListedFile[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('auto');
  const [margin, setMargin] = useState<'none' | 'small' | 'normal'>('small');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    data: Uint8Array;
    size: number;
    filename: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilesAdded = (newFiles: File[]) => {
    setErrorMessage(null);
    const mapped: ListedFile[] = newFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const handleCreatePdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(10);
    setErrorMessage(null);

    try {
      const raw = files.map((f) => ({ file: f.file }));
      const pdfBytes = await imagesToPDF(
        raw,
        { pageSize, orientation, margin },
        (p) => setProgress(p)
      );

      const baseName = files[0].file.name.substring(0, files[0].file.name.lastIndexOf('.')) || 'images';
      const filename = `${baseName}_converted.pdf`;

      setResult({
        data: pdfBytes,
        size: pdfBytes.byteLength,
        filename,
      });
      setProgress(100);
    } catch (err: any) {
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
    // Revoke any created URLs
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setFiles([]);
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
            {language === 'ar' ? 'تم إنشاء ملف PDF بنجاح من الصور:' : 'PDF document created successfully from images:'}{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {result.filename}
            </span>
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {t.common.newSize} {formatBytes(result.size, language)}
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
      {files.length === 0 ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,image/jpg"
          multiple={true}
          onFilesSelected={handleFilesAdded}
          title={language === 'ar' ? 'اختر الصور لتحويلها إلى PDF' : 'Select Images to Convert to PDF'}
          subtitle={
            language === 'ar'
              ? 'اسحب صور JPG أو PNG أو WebP إلى هنا، أو انقر للاختيار'
              : 'Drag & drop JPG, PNG, or WebP images here, or click to choose'
          }
          hint={t.common.dropzoneHintImages}
          disabled={isProcessing}
        />
      ) : (
        <div className="space-y-6">
          <FileList
            files={files}
            onReorder={setFiles}
            onRemove={(id) => {
              const item = files.find((f) => f.id === id);
              if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
              setFiles((prev) => prev.filter((f) => f.id !== id));
            }}
            onClear={handleReset}
            onAddMore={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/jpeg,image/png,image/webp,image/jpg';
              input.multiple = true;
              input.onchange = (e: any) => {
                if (e.target.files?.length) {
                  handleFilesAdded(Array.from(e.target.files));
                }
              };
              input.click();
            }}
            isImage={true}
          />

          {/* Options Panel */}
          <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'ar' ? 'إعدادات صفحات PDF:' : 'PDF Page Settings:'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Page size */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  {language === 'ar' ? 'حجم الصفحة' : 'Page Size'}
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                >
                  <option value="a4">{language === 'ar' ? 'A4 قياسي' : 'A4 Standard'}</option>
                  <option value="fit">{language === 'ar' ? 'مطابق لحجم الصورة' : 'Fit to Image'}</option>
                </select>
              </div>

              {/* Orientation */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  {language === 'ar' ? 'الاتجاه' : 'Orientation'}
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  disabled={pageSize === 'fit'}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white disabled:opacity-50"
                >
                  <option value="auto">{language === 'ar' ? 'تلقائي (حسب كل صورة)' : 'Auto (per image)'}</option>
                  <option value="portrait">{language === 'ar' ? 'طولي (عمودي)' : 'Portrait'}</option>
                  <option value="landscape">{language === 'ar' ? 'عرضي (أفقي)' : 'Landscape'}</option>
                </select>
              </div>

              {/* Margins */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  {language === 'ar' ? 'الهوامش' : 'Margins'}
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                >
                  <option value="none">{language === 'ar' ? 'بدون هوامش' : 'No Margins'}</option>
                  <option value="small">{language === 'ar' ? 'هوامش صغيرة' : 'Small Margins'}</option>
                  <option value="normal">{language === 'ar' ? 'هوامش قياسية' : 'Standard Margins'}</option>
                </select>
              </div>
            </div>
          </div>

          {isProcessing && (
            <ProgressBar
              progress={progress}
              label={t.common.processing}
              sublabel={t.common.pleaseWait}
            />
          )}

          {errorMessage && (
            <div className="max-w-2xl mx-auto flex items-center gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCreatePdf}
              disabled={isProcessing || files.length === 0}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
            >
              <Images className="w-5 h-5" />
              <span>
                {language === 'ar'
                  ? `تحويل ${files.length} صور إلى PDF`
                  : `Convert ${files.length} Images to PDF`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
