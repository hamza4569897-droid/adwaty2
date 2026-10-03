import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, RefreshCw as ConvertIcon, Archive } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FileDropzone } from '../common/FileDropzone';
import { ProgressBar } from '../common/ProgressBar';
import { convertImageFormat } from '../../utils/imageUtils';
import { downloadBlob, downloadAsZip, formatBytes } from '../../utils/downloadHelper';

interface ConvertedItem {
  id: string;
  name: string;
  blob: Blob;
  dataUrl: string;
  filename: string;
  originalSize: number;
}

export const ConvertImageTool: React.FC = () => {
  const { language, t } = useApp();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedItems, setConvertedItems] = useState<ConvertedItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilesAdded = (newFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setErrorMessage(null);
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    setProgress(5);
    setErrorMessage(null);

    const results: ConvertedItem[] = [];
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const res = await convertImageFormat(file, targetFormat);
        results.push({
          id: `${file.name}-${i}-${Date.now()}`,
          name: file.name,
          blob: res.blob,
          dataUrl: res.dataUrl,
          filename: res.filename,
          originalSize: file.size,
        });
        setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }
      setConvertedItems(results);
    } catch {
      setErrorMessage(t.common.corruptedFileError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (item: ConvertedItem) => {
    downloadBlob(item.blob, item.filename);
  };

  const handleDownloadAllZip = async () => {
    const files = convertedItems.map((item) => ({
      name: item.filename,
      data: item.blob,
    }));
    await downloadAsZip(files, `converted_images_${targetFormat}.zip`);
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setConvertedItems([]);
    setErrorMessage(null);
    setProgress(0);
  };

  if (convertedItems.length > 0) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.common.success}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {language === 'ar'
              ? `تم تحويل ${convertedItems.length} صور إلى صيغة ${targetFormat.toUpperCase()}`
              : `Successfully converted ${convertedItems.length} images to ${targetFormat.toUpperCase()}`}
          </p>
        </div>

        <div className="space-y-3">
          {convertedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                  src={item.dataUrl}
                  alt={item.filename}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {item.filename}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatBytes(item.blob.size, language)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadSingle(item)}
                className="shrink-0 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.common.download}</span>
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          {convertedItems.length > 1 && (
            <button
              type="button"
              onClick={handleDownloadAllZip}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
            >
              <Archive className="w-5 h-5" />
              <span>{t.common.downloadZip}</span>
            </button>
          )}

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
      {selectedFiles.length === 0 ? (
        <FileDropzone
          accept="image/*"
          multiple={true}
          onFilesSelected={handleFilesAdded}
          title={language === 'ar' ? 'اختر الصور لتحويل صيغتها' : 'Select Images to Convert'}
          subtitle={
            language === 'ar'
              ? 'حوّل بين JPG و PNG و WebP بنقرة واحدة داخل جهازك'
              : 'Convert between JPG, PNG, and WebP in one click'
          }
          hint={t.common.dropzoneHintImages}
          disabled={isProcessing}
        />
      ) : (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-sm">
              <span className="font-semibold text-slate-900 dark:text-white">
                {t.common.filesSelected.replace('{count}', selectedFiles.length.toString())}
              </span>{' '}
              <span className="text-xs text-slate-500">
                ({formatBytes(selectedFiles.reduce((a, b) => a + b.size, 0), language)})
              </span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-rose-600 transition-colors"
            >
              {t.common.clearAll}
            </button>
          </div>

          {/* Format selection */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <label className="block text-sm font-bold text-slate-900 dark:text-white">
              {language === 'ar' ? 'اختر الصيغة المراد التحويل إليها:' : 'Select Target Format:'}
            </label>

            <div className="grid grid-cols-3 gap-3">
              {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setTargetFormat(fmt)}
                  className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all min-h-[48px] ${
                    targetFormat === fmt
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {fmt === 'jpeg' ? 'JPG' : fmt.toUpperCase()}
                </button>
              ))}
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
              <ConvertIcon className="w-5 h-5" />
              <span>
                {language === 'ar'
                  ? `تحويل ${selectedFiles.length} صور إلى ${targetFormat === 'jpeg' ? 'JPG' : targetFormat.toUpperCase()}`
                  : `Convert ${selectedFiles.length} Images to ${targetFormat === 'jpeg' ? 'JPG' : targetFormat.toUpperCase()}`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
