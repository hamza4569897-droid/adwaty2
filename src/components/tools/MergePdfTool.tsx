import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, FileStack } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FileDropzone } from '../common/FileDropzone';
import { FileList, ListedFile } from '../common/FileList';
import { ProgressBar } from '../common/ProgressBar';
import { mergePDFs } from '../../utils/pdfUtils';
import { downloadArrayBuffer, formatBytes } from '../../utils/downloadHelper';

export const MergePdfTool: React.FC = () => {
  const { language, t } = useApp();
  const [files, setFiles] = useState<ListedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedResult, setMergedResult] = useState<{
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
    }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى اختيار ملفين PDF على الأقل لدمجهما'
          : 'Please select at least 2 PDF files to merge'
      );
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(5);
      setErrorMessage(null);

      const rawFiles = files.map((f) => f.file);
      const mergedBytes = await mergePDFs(rawFiles, (p) => setProgress(p));

      const firstFileName = files[0].file.name.replace(/\.pdf$/i, '');
      const resultName = `${firstFileName}_merged.pdf`;

      setMergedResult({
        data: mergedBytes,
        size: mergedBytes.byteLength,
        filename: resultName,
      });
      setProgress(100);
    } catch (err: any) {
      if (err?.message === 'ENCRYPTED_FILE') {
        setErrorMessage(t.common.encryptedPdfError);
      } else {
        setErrorMessage(t.common.corruptedFileError);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (mergedResult) {
      downloadArrayBuffer(mergedResult.data, mergedResult.filename, 'application/pdf');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setMergedResult(null);
    setErrorMessage(null);
    setProgress(0);
  };

  if (mergedResult) {
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
            {language === 'ar' ? 'تم دمج الملفات بنجاح في مستند واحد:' : 'Files successfully merged into one document:'}{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {mergedResult.filename}
            </span>
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {t.common.newSize} {formatBytes(mergedResult.size, language)}
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
          accept="application/pdf"
          multiple={true}
          onFilesSelected={handleFilesAdded}
          title={language === 'ar' ? 'اختر ملفات PDF لدمجها' : 'Select PDF Files to Merge'}
          subtitle={
            language === 'ar'
              ? 'اسحب ملفين PDF أو أكثر إلى هنا، أو اضغط للتصفح'
              : 'Drag & drop 2 or more PDF files here, or click to browse'
          }
          hint={t.common.dropzoneHintPdf}
          disabled={isProcessing}
        />
      ) : (
        <div className="space-y-6">
          <FileList
            files={files}
            onReorder={setFiles}
            onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
            onClear={() => setFiles([])}
            onAddMore={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'application/pdf';
              input.multiple = true;
              input.onchange = (e: any) => {
                if (e.target.files?.length) {
                  handleFilesAdded(Array.from(e.target.files));
                }
              };
              input.click();
            }}
          />

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
              onClick={handleMerge}
              disabled={isProcessing || files.length < 2}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-98 transition-all"
            >
              <FileStack className="w-5 h-5" />
              <span>
                {language === 'ar'
                  ? `دمج ${files.length} ملفات PDF`
                  : `Merge ${files.length} PDF Files`}
              </span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isProcessing}
              className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              {t.common.reset}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
