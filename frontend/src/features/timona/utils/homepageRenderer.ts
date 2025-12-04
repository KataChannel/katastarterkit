/**
 * Timona Homepage Renderer Utility
 * 
 * This utility renders homepage sections based on page builder configuration
 * from default-pages-timona.json
 */

import { BlockType } from '@/types/page-builder';

// Map section types to component names
export const TIMONA_SECTION_TYPE_MAP: Record<string, string> = {
  'HERO_SLIDER': 'HeroSlider',
  'STATS': 'StatsSection',
  'COURSES_GRID': 'CoursesSection',
  'FAQ': 'FAQSection',
  'TEAM': 'InstructorsSection',
  'TESTIMONIAL': 'TestimonialsSection',
  'CONTACT_FORM': 'RegistrationSection',
  'BRANCHES': 'BranchesSection',
  'COMMITMENTS': 'CommitmentsSection',
};

// Default section order for Timona homepage
export const TIMONA_DEFAULT_SECTIONS = [
  { id: 'hero-slider', type: 'HERO_SLIDER', order: 1 },
  { id: 'stats-section', type: 'STATS', order: 2 },
  { id: 'courses-section', type: 'COURSES_GRID', order: 3 },
  { id: 'commitments-section', type: 'COMMITMENTS', order: 4 },
  { id: 'instructors-section', type: 'TEAM', order: 5 },
  { id: 'testimonials-section', type: 'TESTIMONIAL', order: 6 },
  { id: 'faq-section', type: 'FAQ', order: 7 },
  { id: 'registration-section', type: 'CONTACT_FORM', order: 8 },
  { id: 'branches-section', type: 'BRANCHES', order: 9 },
];

// Get section component from type
export function getSectionComponentName(sectionType: string): string | null {
  return TIMONA_SECTION_TYPE_MAP[sectionType] || null;
}

// Interface for section data
export interface TimonaSectionData {
  id: string;
  type: string;
  order: number;
  data?: any;
  isVisible?: boolean;
}

// Sort sections by order
export function sortSectionsByOrder(sections: TimonaSectionData[]): TimonaSectionData[] {
  return [...sections].sort((a, b) => a.order - b.order);
}

// Filter visible sections
export function filterVisibleSections(sections: TimonaSectionData[]): TimonaSectionData[] {
  return sections.filter(section => section.isVisible !== false);
}

// Get default homepage sections for Timona
export function getTimonaDefaultSections(): TimonaSectionData[] {
  return TIMONA_DEFAULT_SECTIONS.map(section => ({
    ...section,
    isVisible: true,
  }));
}

// Convert page block to section data
export function pageBlockToSectionData(block: any): TimonaSectionData {
  return {
    id: block.id,
    type: block.type,
    order: block.order || 0,
    data: block.content,
    isVisible: block.isVisible !== false,
  };
}
