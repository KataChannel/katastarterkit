// Block types and interfaces
export enum BlockType {
  // Content Blocks
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  GALLERY = 'GALLERY',
  CAROUSEL = 'CAROUSEL',
  HERO = 'HERO',
  BUTTON = 'BUTTON',
  CARD = 'CARD',
  TESTIMONIAL = 'TESTIMONIAL',
  FAQ = 'FAQ',
  CONTACT_FORM = 'CONTACT_FORM',
  DIVIDER = 'DIVIDER',
  SPACER = 'SPACER',
  TEAM = 'TEAM',
  STATS = 'STATS',
  CONTACT_INFO = 'CONTACT_INFO',
  
  // Container/Layout Blocks (for nested children)
  CONTAINER = 'CONTAINER',
  SECTION = 'SECTION',
  GRID = 'GRID',
  FLEX_ROW = 'FLEX_ROW',
  FLEX_COLUMN = 'FLEX_COLUMN',
  
  // Dynamic Blocks
  DYNAMIC = 'DYNAMIC',
  
  // E-commerce Blocks (Data-driven)
  PRODUCT_LIST = 'PRODUCT_LIST',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
}

export enum PageStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// Dynamic Block Configuration Interface
export interface DynamicBlockConfig {
  // Template-based rendering
  templateId?: string;
  templateName?: string;
  
  // Data source configuration
  dataSource?: {
    type: 'api' | 'graphql' | 'static' | 'database';
    endpoint?: string;
    query?: string;
    variables?: Record<string, any>;
    staticData?: any;
  };
  
  // Runtime variables
  variables?: Record<string, any>;
  
  // Conditional rendering
  conditions?: Array<{
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'exists';
    value: any;
    logic?: 'AND' | 'OR';
  }>;
  
  // Event handlers
  events?: {
    onClick?: string;
    onLoad?: string;
    onChange?: string;
  };
  
  // Repeater configuration (for dynamic lists)
  repeater?: {
    enabled: boolean;
    dataPath?: string;
    itemTemplate?: any;
    limit?: number;
  };
}

// Container Block Content (for layout blocks with children)
export interface ContainerBlockContent {
  layout?: 'stack' | 'wrap' | 'scroll';
  gap?: number;
  padding?: number;
  backgroundColor?: string;
  maxWidth?: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface SectionBlockContent {
  fullWidth?: boolean;
  containerWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  backgroundColor?: string;
  backgroundImage?: string;
  padding?: {
    top?: number;
    bottom?: number;
  };
}

export interface GridBlockContent {
  columns?: number;
  gap?: number;
  columnTemplate?: string;
  rowTemplate?: string;
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
}

export interface FlexBlockContent {
  direction?: 'row' | 'column';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
  gap?: number;
}

export interface PageBlock {
  id: string;
  type: BlockType;
  content: any;
  style?: any;
  order: number;
  isVisible: boolean;
  pageId: string;
  
  // Nested block support
  children?: PageBlock[];
  parentId?: string | null;
  depth?: number;
  
  // Dynamic configuration
  config?: DynamicBlockConfig;
  
  createdAt: string;
  updatedAt: string;
}

// Layout settings for page header/footer
export interface PageLayoutSettings {
  hasHeader?: boolean;
  hasFooter?: boolean;
  headerMenuId?: string | null;
  footerMenuId?: string | null;
  headerStyle?: 'default' | 'transparent' | 'fixed' | 'sticky';
  footerStyle?: 'default' | 'minimal' | 'extended';
  
  // Custom header/footer configuration
  headerVariant?: 'default' | 'minimal' | 'centered' | 'mega';
  footerVariant?: 'default' | 'minimal' | 'extended' | 'newsletter';
  headerConfig?: any; // HeaderProps from /types/layout
  footerConfig?: any; // FooterProps from /types/layout
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: any;
  status: PageStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  blocks?: PageBlock[];
  layoutSettings?: PageLayoutSettings;
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
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea';
    required: boolean;
    placeholder?: string;
  }>;
  submitText?: string;
  successMessage?: string;
}

export interface TeamBlockContent {
  title?: string;
  subtitle?: string;
  members: Array<{
    name: string;
    position: string;
    bio?: string;
    image?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
      email?: string;
    };
  }>;
  layout?: 'grid' | 'carousel';
  columns?: number;
}

export interface StatsBlockContent {
  title?: string;
  subtitle?: string;
  stats: Array<{
    value: string;
    label: string;
    description?: string;
    icon?: string;
  }>;
  layout?: 'horizontal' | 'grid';
  animated?: boolean;
}

export interface ContactInfoBlockContent {
  title?: string;
  subtitle?: string;
  contacts: Array<{
    type: 'address' | 'phone' | 'email' | 'hours';
    label: string;
    value: string;
    icon?: string;
  }>;
  showMap?: boolean;
  mapEmbedUrl?: string;
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
  content?: any;
  status: PageStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  layoutSettings?: PageLayoutSettings;
}

export interface UpdatePageInput {
  title?: string;
  slug?: string;
  content?: any;
  status?: PageStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  layoutSettings?: PageLayoutSettings;
}

export interface CreatePageBlockInput {
  type: BlockType;
  content: any;
  style?: BlockStyle;
  order: number;
  isVisible?: boolean;
  parentId?: string | null;
  depth?: number;
  config?: DynamicBlockConfig;
  children?: CreatePageBlockInput[];
}

export interface UpdatePageBlockInput {
  id?: string;
  type?: BlockType;
  content?: any;
  style?: BlockStyle;
  order?: number;
  isVisible?: boolean;
  parentId?: string | null;
  depth?: number;
  config?: DynamicBlockConfig;
  children?: UpdatePageBlockInput[];
}

export interface PageFiltersInput {
  status?: PageStatus;
  search?: string;
}

export interface BulkUpdateBlockOrderInput {
  id: string;
  order: number;
}

// E-commerce Block Content Interfaces
export interface ProductListBlockContent {
  title?: string;
  subtitle?: string;
  limit?: number;
  categoryId?: string;
  filters?: {
    isFeatured?: boolean;
    isNew?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  };
  layout?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
  showPrice?: boolean;
  showCategory?: boolean;
  showDescription?: boolean;
  showAddToCart?: boolean;
  cardVariant?: 'default' | 'compact' | 'detailed';
  style?: any;
}

export interface ProductDetailBlockContent {
  productSlug?: string;
  showGallery?: boolean;
  showDescription?: boolean;
  showSpecs?: boolean;
  showReviews?: boolean;
  showRelated?: boolean;
  layout?: 'default' | 'wide' | 'sidebar';
  style?: any;
}