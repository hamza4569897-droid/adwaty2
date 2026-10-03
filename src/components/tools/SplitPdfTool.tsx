import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, Scissors, FileText, Archive } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useApp } from '../../context/AppContext';
import { FileDropzone } from '../common/FileDropzone';
import { ProgressBar } from '../common/ProgressBar';
import { parsePageRanges, splitPDFByRange, splitAllPages } from '../../utils/pdfUtils';
import { downloadArrayBuffer, downloadAsZip, formatBytes } from '../../utils/downloadHelper';

export const SplitPdfTool: React.FC = () => {
  const { language, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<'range' | 'all'>('range');
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [result, setResult] = useState<{
    type: 'single' | 'zip';
    data?: Uint8Array;
    zipFiles?: { name: string; data: Uint8Array }[];
    filename: string;
    size?: number;
  } | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (!files.length) return;
    const selected = files[0];
    setErrorMessage(null);

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const count = doc.getPageCount();
      setFile(selected);
      setTotalPages(count);
      setRangeInput(count > 1 ? `1-${Math.min(count, 3)}` : '1');
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes('encrypt')) {
        setErrorMessage(t.common.encryptedPdfError);
      } else {
        setErrorMessage(t.common.corruptedFileError);
      }
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setErrorMessage(null);
    setIsProcessing(true);
    setProgress(5);

    try {
      const baseName = file.name.replace(/\.pdf$/i, '');

      if (splitMode === 'range') {
        const pages = parsePageRanges(rangeInput, totalPages);
        if (pages.length === 0) {
          setErrorMessage(
            language === 'ar'
              ? 'يرجى إدخال نطاق صفحات صالح (مثال: 1-3 أو 1, 4)'
              : 'Please enter a valid page range (e.g. 1-3 or 1, 4)'
          );
          setIsProcessing(false);
          return;
        }

        const splitBytes = await splitPDFByRange(file, pages, (p) => setProgress(p));
        setResult({
          type: 'single',
          data: splitBytes,
          filename: `${baseName}_pages_${rangeInput.replace(/[^0-9-]/g, '_')}.pdf`,
          size: splitBytes.byteLength,
        });
      } else {
        // Split all pages into individual files packaged in ZIP
        const splitItems = await splitAllPages(file, (curr, total) => {
          setProgress(Math.round((curr / total) * 100));
        });

        setResult({
          type: 'zip',
          zipFiles: splitItems.map((item) => ({ name: item.filename, data: item.data })),
          filename: `${baseName}_pages_split.zip`,
        });
      }
      setProgress(100);
    } catch (err: any) {
      setErrorMessage(t.common.corruptedFileError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    if (result.type === 'single' && result.data) {
      downloadArrayBuffer(result.data, result.filename, 'application/pdf');
    } else if (result.type === 'zip' && result.zipFiles) {
      await downloadAsZip(result.zipFiles, result.filename);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
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
            {result.type === 'single'
              ? language === 'ar'
                ? 'تم استخراج الصفحات بنجاح في ملف واحد:'
                : 'Pages successfully extracted into a single file:'
              : language === 'ar'
              ? `تم تقسيم جميع صفحات الملف (${totalPages} صفحة) في حزمة مضغوطة:`
              : `All pages (${totalPages} pages) successfully split into ZIP:`}{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {result.filename}
            </span>
          </p>
          {result.size && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {t.common.newSize} {formatBytes(result.size, language)}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
          >
            {result.type === 'zip' ? <Archive className="w-5 h-5" /> : <Download className="w-5 h-5" />}
            <span>{result.type === 'zip' ? t.common.downloadZip : t.common.download}</span>
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
          title={language === 'ar' ? 'اختر ملف PDF لتقسيمه' : 'Select PDF File to Split'}
          subtitle={
            language === 'ar'
              ? 'اسحب ملف PDF إلى هنا، أو اضغط للتصفح من جهازك'
              : 'Drag & drop a PDF file here, or click to browse'
          }
          hint={t.common.dropzoneHintPdf}
          disabled={isProcessing}
        />
      ) : (
        <div className="max-w-xl mx-auto space-y-6">
          {/* File Card info */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatBytes(file.size, language)} ·{' '}
                  {language === 'ar' ? `${totalPages} صفحة` : `${totalPages} pages`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-rose-600 px-2 py-1 transition-colors"
            >
              {language === 'ar' ? 'تغيير الملف' : 'Change file'}
            </button>
          </div>

          {/* Mode Selector */}
          <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white">
              {language === 'ar' ? 'طريقة التقسيم المطلوبة:' : 'Splitting Mode:'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSplitMode('range')}
                className={`p-4 rounded-xl border text-start transition-all min-h-[56px] ${
                  splitMode === 'range'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-sm mb-1">
                  {language === 'ar' ? 'استخراج نطاق صفحات' : 'Custom Page Ranges'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'ar' ? 'تحديد صفحات مثل: 1-3, 5' : 'Specify pages like: 1-3, 5'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSplitMode('all')}
                className={`p-4 rounded-xl border text-start transition-all min-h-[56px] ${
                  splitMode === 'all'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-sm mb-1">
                  {language === 'ar' ? 'استخراج كل صفحة منفصلة' : 'Split Every Page'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'ar' ? 'تحميل كل الصفحات في ملف ZIP' : 'Save all pages into a ZIP file'}
                </div>
              </button>
            </div>

            {splitMode === 'range' && (
              <div className="pt-2 space-y-2">
                <label
                  htmlFor="pageRange"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {language === 'ar'
                    ? `أدخل أرقام الصفحات (من 1 إلى ${totalPages}):`
                    : `Enter page numbers (from 1 to ${totalPages}):`}
                </label>
                <input
                  id="pageRange"
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: 1-3, 5, 8' : 'e.g. 1-3, 5, 8'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {language === 'ar'
                    ? 'استخدم الفاصلة للفصل بين الصفحات أو الشرطة للنطاقات المتتالية'
                    : 'Use commas to separate single pages and dashes for consecutive ranges'}
                </p>
              </div>
            )}
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
              onClick={handleSplit}
              disabled={isProcessing}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
            >
              <Scissors className="w-5 h-5" />
              <span>{language === 'ar' ? 'بدء تقسيم PDF' : 'Start Splitting PDF'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
