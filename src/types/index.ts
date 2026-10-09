export type ToolCategoryId =
  | 'image-tools'
  | 'video-tools'
  | 'audio-tools'
  | 'gif-tools'
  | 'pdf-tools'
  | 'document-tools'
  | 'file-tools'
  | 'unit-converters'
  | 'calculators'
  | 'date-time-tools'
  | 'developer-tools'
  | 'seo-tools'
  | 'color-tools'
  | 'security-tools'
  | 'education-tools'
  | 'business-tools'
  | 'security-generators'
  | 'social-media-tools';

export interface ToolCategory {
  id: ToolCategoryId;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string; // Tailwind color theme, e.g. 'blue', 'orange'
  bgColor: string;
  badgeColor: string;
  count?: number;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolExample {
  title: string;
  input: string;
  output: string;
  explanation?: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  category: ToolCategoryId;
  description: string;
  shortDesc: string;
  keywords: string[];
  icon: string;
  accentColor?: string; // e.g. 'orange', 'violet', 'pink', 'emerald'
  accentHex?: string; // e.g. '#f97316'
  colorClass?: string;
  bgGradient?: string;
  isPopular?: boolean;
  isNew?: boolean;
  componentId?: string; // Maps to active interactive widget
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
    schemaType?: string;
  };
  howToUse: string[];
  features: string[];
  examples?: ToolExample[];
  faqs?: ToolFAQ[];
  relatedSlugs?: string[];
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}
