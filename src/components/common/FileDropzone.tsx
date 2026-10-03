import React, { useRef, useState } from 'react';
import { UploadCloud, FileUp, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FileDropzoneProps {
  accept: string; // e.g. "application/pdf" or "image/*"
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  hint?: string;
  maxSizeBytes?: number; // default 100MB
  disabled?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  accept,
  multiple = false,
  onFilesSelected,
  title,
  subtitle,
  hint,
  maxSizeBytes = 100 * 1024 * 1024, // 100 MB
  disabled = false,
}) => {
  const { language, t } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const validFiles: File[] = [];
    const oversizedFiles: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxSizeBytes) {
        oversizedFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    }

    if (oversizedFiles.length > 0) {
      setErrorMessage(t.common.fileTooLargeError);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const triggerSelect = () => {
    if (disabled) return;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      <div
        onClick={triggerSelect}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerSelect();
          }
        }}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
          isDragOver
            ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 dark:border-blue-400 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4 transition-transform group-hover:scale-105">
          <UploadCloud className="h-8 w-8 stroke-[1.75]" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
          {title || t.common.dropzoneTitle}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          <span className="hidden sm:inline">{subtitle || t.common.dropzoneSubtitle}</span>
          <span className="sm:hidden">{t.common.dropzoneMobileTap}</span>
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerSelect();
          }}
          disabled={disabled}
          className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm shadow-blue-600/20 active:scale-95 transition-all"
        >
          <FileUp className="w-4 h-4" />
          <span>{t.common.browseFiles}</span>
        </button>

        {hint && (
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            {hint}
          </p>
        )}
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
