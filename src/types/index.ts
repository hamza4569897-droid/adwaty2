export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export type ToolCategory = 'pdf' | 'image' | 'text' | 'calculator' | 'generator';

export type CalculatorSubCategory =
  | 'financial'
  | 'salary'
  | 'gold'
  | 'health'
  | 'math'
  | 'home'
  | 'travel'
  | 'cooking'
  | 'religious'
  | 'tech';

export interface ToolDefinition {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  category: ToolCategory;
  subCategory?: CalculatorSubCategory;
  iconName: string;
  badgeAr?: string;
  badgeEn?: string;
  popular?: boolean;
  relatedTools?: string[];
}

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  pageCount?: number;
  rotation?: number; // for rotate tool
  selected?: boolean; // for delete/select tool
}

export interface ToolFaq {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

export interface ToolSeoContent {
  metaTitleAr: string;
  metaTitleEn: string;
  metaDescAr: string;
  metaDescEn: string;
  h1Ar: string;
  h1En: string;
  stepsAr: { title: string; desc: string }[];
  stepsEn: { title: string; desc: string }[];
  benefitsAr: { title: string; desc: string }[];
  benefitsEn: { title: string; desc: string }[];
  faqs: ToolFaq[];
  relatedTools: string[]; // slugs
}
