import React, { Suspense, lazy } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { TOOLS } from '../data/toolsData';
import { CALCULATORS } from '../data/calculatorsData';
import { ToolLayout } from '../components/common/ToolLayout';

// Lazy-loaded tools for lightning-fast initial bundle
const MergePdfTool = lazy(() => import('../components/tools/MergePdfTool').then(m => ({ default: m.MergePdfTool })));
const SplitPdfTool = lazy(() => import('../components/tools/SplitPdfTool').then(m => ({ default: m.SplitPdfTool })));
const ImagesToPdfTool = lazy(() => import('../components/tools/ImagesToPdfTool').then(m => ({ default: m.ImagesToPdfTool })));
const CompressImageTool = lazy(() => import('../components/tools/CompressImageTool').then(m => ({ default: m.CompressImageTool })));
const ResizeImageTool = lazy(() => import('../components/tools/ResizeImageTool').then(m => ({ default: m.ResizeImageTool })));
const ConvertImageTool = lazy(() => import('../components/tools/ConvertImageTool').then(m => ({ default: m.ConvertImageTool })));
const RotatePdfTool = lazy(() => import('../components/tools/RotatePdfTool').then(m => ({ default: m.RotatePdfTool })));
const DeletePdfPagesTool = lazy(() => import('../components/tools/DeletePdfPagesTool').then(m => ({ default: m.DeletePdfPagesTool })));
const PdfToImagesTool = lazy(() => import('../components/tools/PdfToImagesTool').then(m => ({ default: m.PdfToImagesTool })));
const WordCounterTool = lazy(() => import('../components/tools/WordCounterTool').then(m => ({ default: m.WordCounterTool })));
const NumberToWordsTool = lazy(() => import('../components/tools/NumberToWordsTool').then(m => ({ default: m.NumberToWordsTool })));

// Batch 1 Text Tools
const RemoveTashkeelTool = lazy(() => import('../components/tools/RemoveTashkeelTool').then(m => ({ default: m.RemoveTashkeelTool })));
const ArabicIndianDigitsTool = lazy(() => import('../components/tools/ArabicIndianDigitsTool').then(m => ({ default: m.ArabicIndianDigitsTool })));
const TextCleanerTool = lazy(() => import('../components/tools/TextCleanerTool').then(m => ({ default: m.TextCleanerTool })));
const SortDedupeTool = lazy(() => import('../components/tools/SortDedupeTool').then(m => ({ default: m.SortDedupeTool })));
const CaseConverterTool = lazy(() => import('../components/tools/CaseConverterTool').then(m => ({ default: m.CaseConverterTool })));
const TextDiffTool = lazy(() => import('../components/tools/TextDiffTool').then(m => ({ default: m.TextDiffTool })));
const LoremIpsumTool = lazy(() => import('../components/tools/LoremIpsumTool').then(m => ({ default: m.LoremIpsumTool })));
const NameDecoratorTool = lazy(() => import('../components/tools/NameDecoratorTool').then(m => ({ default: m.NameDecoratorTool })));
const TextToSlugAndUrlTool = lazy(() => import('../components/tools/TextToSlugAndUrlTool').then(m => ({ default: m.TextToSlugAndUrlTool })));
const RandomPickerTool = lazy(() => import('../components/tools/RandomPickerTool').then(m => ({ default: m.RandomPickerTool })));

export const ToolPageWrapper: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (slug && CALCULATORS.some((c) => c.slug === slug)) {
    return <Navigate to={`/calculators/${slug}`} replace />;
  }

  const tool = TOOLS.find((t) => t.slug === slug);

  if (!tool) {
    return <Navigate to="/" replace />;
  }

  const renderToolComponent = () => {
    switch (tool.slug) {
      // PDF & Images
      case 'merge-pdf':
        return <MergePdfTool />;
      case 'split-pdf':
        return <SplitPdfTool />;
      case 'images-to-pdf':
        return <ImagesToPdfTool />;
      case 'compress-image':
        return <CompressImageTool />;
      case 'resize-image':
        return <ResizeImageTool />;
      case 'convert-image':
        return <ConvertImageTool />;
      case 'rotate-pdf':
        return <RotatePdfTool />;
      case 'delete-pdf':
        return <DeletePdfPagesTool />;
      case 'pdf-to-images':
        return <PdfToImagesTool />;

      // Batch 1 Text Tools
      case 'word-counter':
        return <WordCounterTool />;
      case 'number-to-words':
        return <NumberToWordsTool />;
      case 'remove-tashkeel':
        return <RemoveTashkeelTool />;
      case 'arabic-indian-digits':
        return <ArabicIndianDigitsTool />;
      case 'text-cleaner':
        return <TextCleanerTool />;
      case 'sort-dedupe':
        return <SortDedupeTool />;
      case 'case-converter':
        return <CaseConverterTool />;
      case 'text-diff':
        return <TextDiffTool />;
      case 'lorem-ipsum':
        return <LoremIpsumTool />;
      case 'name-decorator':
        return <NameDecoratorTool />;
      case 'text-to-slug-and-url':
        return <TextToSlugAndUrlTool />;
      case 'random-picker':
        return <RandomPickerTool />;
      default:
        return null;
    }
  };

  return (
    <ToolLayout tool={tool}>
      <Suspense
        fallback={
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">جارٍ تحميل الأداة...</p>
          </div>
        }
      >
        {renderToolComponent()}
      </Suspense>
    </ToolLayout>
  );
};
