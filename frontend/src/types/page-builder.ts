// Block types and interfaces
export enum BlockType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE', 
  HERO = 'HERO',
  BUTTON = 'BUTTON',
  DIVIDER = 'DIVIDER',
  SPACER = 'SPACER',
}

export enum PageStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface PageBlock {
  id: string;
  type: BlockType;
  content: any;
  style?: any;
  order: number;
  isVisible: boolean;
  pageId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  status: PageStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  blocks?: PageBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPages {
  items: Page[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Block content interfaces
export interface TextBlockContent {
  html: string;
  text: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
}

export interface ImageBlockContent {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill';
}

export interface HeroBlockContent {
  backgroundImage?: string;
  backgroundColor?: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  textAlign?: 'left' | 'center' | 'right';
  overlay?: boolean;
  overlayOpacity?: number;
}

export interface ButtonBlockContent {
  text: string;
  link: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export interface VideoBlockContent {
  url: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export interface GalleryBlockContent {
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  columns?: number;
  spacing?: number;
}

export interface CardBlockContent {
  title: string;
  description?: string;
  image?: string;
  link?: string;
  buttonText?: string;
}

export interface TestimonialBlockContent {
  text: string;
  author: string;
  position?: string;
  company?: string;
  avatar?: string;
}

export interface FAQBlockContent {
  items: {
    question: string;
    answer: string;
  }[];
}

export interface ContactFormBlockContent {
  title?: string;
  description?: string;
  fields: {
    name: string;
    type: 'text' | 'email' | 'tel' | 'textarea';
    label: string;
    placeholder?: string;
    required?: boolean;
  }[];
  submitText?: string;
  successMessage?: string;
}

// Block style interface
export interface BlockStyle {
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  backgroundColor?: string;
  borderRadius?: number;
  border?: {
    width?: number;
    style?: 'solid' | 'dashed' | 'dotted';
    color?: string;
  };
  shadow?: {
    x?: number;
    y?: number;
    blur?: number;
    spread?: number;
    color?: string;
  };
  animation?: {
    type?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';
    duration?: number;
    delay?: number;
  };
}

// Input types for GraphQL
export interface CreatePageInput {
  title: string;
  slug: string;
  content?: string;
  status: PageStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface UpdatePageInput {
  title?: string;
  slug?: string;
  content?: string;
  status?: PageStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface CreatePageBlockInput {
  type: BlockType;
  content: any;
  style?: BlockStyle;
  order: number;
  isVisible?: boolean;
}

export interface UpdatePageBlockInput {
  id?: string;
  type?: BlockType;
  content?: any;
  style?: BlockStyle;
  order?: number;
  isVisible?: boolean;
}

export interface PageFiltersInput {
  status?: PageStatus;
  search?: string;
}

export interface BulkUpdateBlockOrderInput {
  id: string;
  order: number;
}