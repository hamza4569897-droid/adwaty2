import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, FileText, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatBytes } from '../../utils/downloadHelper';

export interface ListedFile {
  id: string;
  file: File;
  previewUrl?: string;
}

interface FileListProps {
  files: ListedFile[];
  onReorder: (newFiles: ListedFile[]) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onAddMore?: () => void;
  isImage?: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onReorder,
  onRemove,
  onClear,
  onAddMore,
  isImage = false,
}) => {
  const { language, t } = useApp();

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;

    const updated = [...files];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    onReorder(updated);
  };

  const totalSize = files.reduce((acc, curr) => acc + curr.file.size, 0);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between px-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {t.common.filesSelected.replace('{count}', files.length.toString())}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            ({formatBytes(totalSize, language)})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onAddMore && (
            <button
              type="button"
              onClick={onAddMore}
              className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.common.addMore}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 px-2 py-1.5 transition-colors"
          >
            {t.common.clearAll}
          </button>
        </div>
      </div>

      {/* List items */}
      <ul className="space-y-2.5">
        {files.map((item, index) => (
          <li
            key={item.id}
            className="group flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all"
          >
            {/* Left: preview/icon and name */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-600 w-5 text-center shrink-0">
                {index + 1}
              </span>

              {item.previewUrl ? (
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
              )}

              <div className="min-w-0 flex-1 pr-2">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {item.file.name}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {formatBytes(item.file.size, language)}
                </p>
              </div>
            </div>

            {/* Right: reordering and remove */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => moveItem(index, 'up')}
                disabled={index === 0}
                className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title={t.common.moveUp}
                aria-label={t.common.moveUp}
              >
                <ArrowUp className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => moveItem(index, 'down')}
                disabled={index === files.length - 1}
                className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title={t.common.moveDown}
                aria-label={t.common.moveDown}
              >
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title={t.common.delete}
                aria-label={t.common.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
