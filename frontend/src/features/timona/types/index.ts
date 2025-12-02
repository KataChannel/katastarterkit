// ==================== COURSE ====================
export interface AcademyCourse {
  id: string;
  title: string; // Changed from 'name' to match Prisma schema
  slug: string;
  shortDescription?: string;
  description?: string;
  duration?: string;
  price?: number;
  discountPrice?: number;
  thumbnail?: string;
  featuredImage?: string;
  images?: string[];
  curriculum?: string[];
  requirements?: string[];
  benefits?: string[];
  isActive: boolean;
  isFeatured: boolean;
  displayOrder?: number;
  sortOrder?: number;
  category?: AcademyCourseCategory;
  createdAt: string;
  updatedAt: string;
}

// ==================== COURSE CATEGORY ====================
export interface AcademyCourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  isActive: boolean;
  sortOrder: number;
  courses?: AcademyCourse[];
  createdAt: string;
  updatedAt: string;
}

// ==================== INSTRUCTOR ====================
export interface AcademyInstructor {
  id: string;
  name: string;
  slug: string;
  title?: string;
  bio?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  experience?: string;
  education?: string;
  certifications?: string;
  linkedIn?: string;
  facebook?: string;
  website?: string;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== TESTIMONIAL ====================
export interface AcademyTestimonial {
  id: string;
  studentName: string;
  studentAvatar?: string;
  studentTitle?: string;
  content: string;
  rating: number;
  videoUrl?: string;
  courseName?: string;
  completedDate?: string;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  isVerified: boolean;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== FAQ ====================
export interface AcademyFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== BRANCH ====================
export interface Branch {
  id: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  email?: string;
  hotline?: string;
  workingHours?: string;
  description?: string;
  shortDescription?: string;
  featuredImage?: string;
  latitude?: number;
  longitude?: number;
  mapEmbedUrl?: string;
  facebookUrl?: string;
  zaloUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== STUDENT WORK ====================
export interface AcademyStudentWork {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  images?: string[];
  category?: string;
  studentName?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== MEDIA COVERAGE ====================
export interface AcademyMediaCoverage {
  id: string;
  title: string;
  source?: string;
  sourceLogo?: string;
  thumbnail?: string;
  videoUrl?: string;
  articleUrl?: string;
  publishedAt?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== REGISTRATION ====================
export enum AcademyRegistrationStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  CONFIRMED = 'CONFIRMED',
  ENROLLED = 'ENROLLED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface AcademyCourseRegistration {
  id: string;
  studentName: string;
  email?: string;
  phone: string;
  course?: AcademyCourse;
  branch?: Branch;
  notes?: string;
  status: AcademyRegistrationStatus;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== INPUT TYPES ====================
export interface CreateAcademyCourseRegistrationInput {
  studentName: string;
  email?: string;
  phone: string;
  courseId?: string;
  branchId?: string;
  notes?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}
