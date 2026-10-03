import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, Minimize2, Archive, Sliders } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FileDropzone } from '../common/FileDropzone';
import { ProgressBar } from '../common/ProgressBar';
import { compressImage, CompressResult } from '../../utils/imageUtils';
import { downloadBlob, downloadAsZip, formatBytes } from '../../utils/downloadHelper';

interface CompressedItem {
  id: string;
  name: string;
  originalSize: number;
  result: CompressResult;
}

export const CompressImageTool: React.FC = () => {
  const { language, t } = useApp();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState<number>(0.75);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressedItems, setCompressedItems] = useState<CompressedItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilesAdded = (newFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setErrorMessage(null);
  };

  const handleCompress = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    setProgress(5);
    setErrorMessage(null);

    const results: CompressedItem[] = [];
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const res = await compressImage(file, quality);
        results.push({
          id: `${file.name}-${i}-${Date.now()}`,
          name: file.name,
          originalSize: file.size,
          result: res,
        });
        setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }
      setCompressedItems(results);
    } catch (err: any) {
      setErrorMessage(t.common.corruptedFileError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (item: CompressedItem) => {
    const ext = item.name.substring(item.name.lastIndexOf('.')) || '.jpg';
    const base = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
    const downloadName = `${base}_compressed${ext}`;
    downloadBlob(item.result.blob, downloadName);
  };

  const handleDownloadAllZip = async () => {
    const files = compressedItems.map((item) => {
      const ext = item.name.substring(item.name.lastIndexOf('.')) || '.jpg';
      const base = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
      return {
        name: `${base}_compressed${ext}`,
        data: item.result.blob,
      };
    });
    await downloadAsZip(files, 'compressed_images.zip');
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setCompressedItems([]);
    setErrorMessage(null);
    setProgress(0);
  };

  const totalOriginal = compressedItems.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalNew = compressedItems.reduce((acc, curr) => acc + curr.result.newSize, 0);
  const totalSavedPercent = totalOriginal > 0 ? Math.round(((totalOriginal - totalNew) / totalOriginal) * 100) : 0;

  if (compressedItems.length > 0) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.common.success}
          </h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold text-sm">
            {t.common.saved.replace('{pct}', totalSavedPercent.toString())} (
            {formatBytes(totalOriginal - totalNew, language)})
          </div>
        </div>

        {/* List of compressed items */}
        <div className="space-y-3">
          {compressedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                  src={item.result.dataUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="line-through text-slate-400">
                      {formatBytes(item.originalSize, language)}
                    </span>{' '}
                    →{' '}
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatBytes(item.result.newSize, language)}
                    </span>{' '}
                    <span className="text-[11px] text-emerald-600">
                      (-{item.result.savedPercent}%)
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadSingle(item)}
                className="shrink-0 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title={t.common.download}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.common.download}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          {compressedItems.length > 1 && (
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
          accept="image/jpeg,image/png,image/webp,image/jpg"
          multiple={true}
          onFilesSelected={handleFilesAdded}
          title={language === 'ar' ? 'اختر الصور لضغطها وتقليل حجمها' : 'Select Images to Compress'}
          subtitle={
            language === 'ar'
              ? 'اسحب صورة واحدة أو أكثر، أو انقر للاختيار من جهازك'
              : 'Drag & drop one or multiple images here, or click to choose'
          }
          hint={t.common.dropzoneHintImages}
          disabled={isProcessing}
        />
      ) : (
        <div className="max-w-xl mx-auto space-y-6">
          {/* Selected files summary */}
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

          {/* Quality Slider Settings */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="qualityRange"
                className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"
              >
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>{language === 'ar' ? 'جودة الصورة والضغط:' : 'Image Quality Level:'}</span>
              </label>
              <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-sm tabular-nums">
                {Math.round(quality * 100)}%
              </span>
            </div>

            <input
              id="qualityRange"
              type="range"
              min="0.1"
              max="0.95"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
            />

            {/* Presets */}
            <div className="flex items-center justify-between text-xs gap-2 pt-1">
              <button
                type="button"
                onClick={() => setQuality(0.5)}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  quality === 0.5
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {language === 'ar' ? 'أقصى ضغط (50%)' : 'Max compression (50%)'}
              </button>
              <button
                type="button"
                onClick={() => setQuality(0.75)}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  quality === 0.75
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {language === 'ar' ? 'متوازن موصى به (75%)' : 'Balanced (75%)'}
              </button>
              <button
                type="button"
                onClick={() => setQuality(0.85)}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  quality === 0.85
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {language === 'ar' ? 'جودة عالية (85%)' : 'High quality (85%)'}
              </button>
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
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
            >
              <Minimize2 className="w-5 h-5" />
              <span>
                {language === 'ar'
                  ? `بدء ضغط ${selectedFiles.length} صور`
                  : `Compress ${selectedFiles.length} Images`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
