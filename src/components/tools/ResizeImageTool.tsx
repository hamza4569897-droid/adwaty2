import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, Scaling, Lock, Unlock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FileDropzone } from '../common/FileDropzone';
import { getImageDimensions, resizeImage, CompressResult } from '../../utils/imageUtils';
import { downloadBlob, formatBytes } from '../../utils/downloadHelper';

interface Preset {
  nameAr: string;
  nameEn: string;
  width: number;
  height: number;
}

const PRESETS: Preset[] = [
  { nameAr: 'صورة شخصية / جواز سفر', nameEn: 'Passport / ID Photo', width: 600, height: 600 },
  { nameAr: 'بروفايل واتساب', nameEn: 'WhatsApp Profile', width: 500, height: 500 },
  { nameAr: 'إنستغرام مربع', nameEn: 'Instagram Square', width: 1080, height: 1080 },
  { nameAr: 'قصة إنستغرام / ريلز', nameEn: 'Instagram Story / Reel', width: 1080, height: 1920 },
  { nameAr: 'غلاف فيسبوك', nameEn: 'Facebook Cover', width: 820, height: 312 },
  { nameAr: 'منشور إكس / تويتر', nameEn: 'X / Twitter Post', width: 1200, height: 675 },
  { nameAr: 'يوتيوب مصغرة', nameEn: 'YouTube Thumbnail', width: 1280, height: 720 },
];

export const ResizeImageTool: React.FC = () => {
  const { language, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);

  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (!files.length) return;
    const selected = files[0];
    setErrorMessage(null);
    try {
      const dims = await getImageDimensions(selected);
      setFile(selected);
      setOriginalWidth(dims.width);
      setOriginalHeight(dims.height);
      setWidth(dims.width);
      setHeight(dims.height);
    } catch {
      setErrorMessage(t.common.corruptedFileError);
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (keepAspectRatio && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (keepAspectRatio && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setWidth(Math.round(val * ratio));
    }
  };

  const applyPreset = (preset: Preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setKeepAspectRatio(false);
  };

  const handleResize = async () => {
    if (!file || width <= 0 || height <= 0) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await resizeImage(file, width, height, format);
      setResult(res);
    } catch {
      setErrorMessage(t.common.corruptedFileError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const ext = format === 'jpeg' ? 'jpg' : format;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    downloadBlob(result.blob, `${base}_${width}x${height}.${ext}`);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setErrorMessage(null);
    setOriginalWidth(0);
    setOriginalHeight(0);
  };

  if (result && file) {
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
            {language === 'ar' ? 'تم تغيير الأبعاد إلى:' : 'Dimensions resized to:'}{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {result.width} × {result.height} بكسل
            </span>
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {formatBytes(result.newSize, language)}
          </p>
        </div>

        <div className="max-w-xs mx-auto rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
          <img src={result.dataUrl} alt="Resized" className="w-full h-auto object-contain max-h-56" />
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
          accept="image/*"
          multiple={false}
          onFilesSelected={handleFileSelected}
          title={language === 'ar' ? 'اختر صورة لتغيير أبعادها' : 'Select Image to Resize'}
          subtitle={
            language === 'ar'
              ? 'اسحب الصورة هنا، أو اضغط للاختيار من جهازك'
              : 'Drag & drop your image here, or click to choose'
          }
          hint={t.common.dropzoneHintImages}
          disabled={isProcessing}
        />
      ) : (
        <div className="max-w-xl mx-auto space-y-6">
          {/* File summary */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-sm">
              <p className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                {file.name}
              </p>
              <p className="text-xs text-slate-500">
                {originalWidth} × {originalHeight} بكسل ({formatBytes(file.size, language)})
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-rose-600 transition-colors"
            >
              {language === 'ar' ? 'تغيير الصورة' : 'Change image'}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'ar' ? 'مقاسات سريعة جاهزة:' : 'Quick Presets:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {language === 'ar' ? p.nameAr : p.nameEn} ({p.width}×{p.height})
                </button>
              ))}
            </div>
          </div>

          {/* Dimension Controls */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ar' ? 'العرض (Width بالبكسل)' : 'Width (px)'}
                </label>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ar' ? 'الارتفاع (Height بالبكسل)' : 'Height (px)'}
                </label>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={height}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setKeepAspectRatio(!keepAspectRatio)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600"
              >
                {keepAspectRatio ? (
                  <Lock className="w-4 h-4 text-blue-600" />
                ) : (
                  <Unlock className="w-4 h-4 text-slate-400" />
                )}
                <span>
                  {language === 'ar' ? 'قفل نسبة الأبعاد (تناسب الطول والعرض)' : 'Lock aspect ratio'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  {language === 'ar' ? 'صيغة الحفظ:' : 'Format:'}
                </span>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                >
                  <option value="jpeg">JPG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResize}
              disabled={isProcessing || width <= 0 || height <= 0}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
            >
              <Scaling className="w-5 h-5" />
              <span>{language === 'ar' ? 'تطبيق وتغيير الحجم' : 'Apply & Resize'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
