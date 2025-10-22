'use client';

import React, { lazy, Suspense } from 'react';
import { BlockType } from '@/types/page-builder';
import BlockErrorBoundary from '../BlockErrorBoundary';

/**
 * Lazy-loaded block components
 * Imported dynamically to reduce initial bundle size
 */
const TextBlock = lazy(() => import('./TextBlock').then(m => ({ default: m.TextBlock })));
const ImageBlock = lazy(() => import('./ImageBlock').then(m => ({ default: m.ImageBlock })));
const HeroBlock = lazy(() => import('./HeroBlock').then(m => ({ default: m.HeroBlock })));
const ButtonBlock = lazy(() => import('./ButtonBlock').then(m => ({ default: m.ButtonBlock })));
const DividerBlock = lazy(() => import('./DividerBlock').then(m => ({ default: m.DividerBlock })));
const SpacerBlock = lazy(() => import('./SpacerBlock').then(m => ({ default: m.SpacerBlock })));
const TeamBlock = lazy(() => import('./TeamBlock').then(m => ({ default: m.TeamBlock })));
const StatsBlock = lazy(() => import('./StatsBlock').then(m => ({ default: m.StatsBlock })));
const ContactInfoBlock = lazy(() => import('./ContactInfoBlock').then(m => ({ default: m.ContactInfoBlock })));
const ContainerBlock = lazy(() => import('./ContainerBlock').then(m => ({ default: m.ContainerBlock })));
const SectionBlock = lazy(() => import('./SectionBlock').then(m => ({ default: m.SectionBlock })));
const GridBlock = lazy(() => import('./GridBlock').then(m => ({ default: m.GridBlock })));
const FlexBlock = lazy(() => import('./FlexBlock').then(m => ({ default: m.FlexBlock })));
const DynamicBlock = lazy(() => import('./DynamicBlock').then(m => ({ default: m.DynamicBlock })));
const CarouselBlock = lazy(() => import('./CarouselBlock'));
const ProductListBlock = lazy(() => import('./ProductListBlock').then(m => ({ default: m.ProductListBlock })));
const ProductDetailBlock = lazy(() => import('./ProductDetailBlock').then(m => ({ default: m.ProductDetailBlock })));
const VideoBlock = lazy(() => import('./VideoBlock').then(m => ({ default: m.VideoBlock })));

/**
 * Block component map for lazy loading
 */
export const LAZY_BLOCK_COMPONENTS: Record<BlockType | string, React.ComponentType<any>> = {
  [BlockType.TEXT]: TextBlock,
  [BlockType.IMAGE]: ImageBlock,
  [BlockType.HERO]: HeroBlock,
  [BlockType.BUTTON]: ButtonBlock,
  [BlockType.DIVIDER]: DividerBlock,
  [BlockType.SPACER]: SpacerBlock,
  [BlockType.TEAM]: TeamBlock,
  [BlockType.STATS]: StatsBlock,
  [BlockType.CONTACT_INFO]: ContactInfoBlock,
  [BlockType.CONTAINER]: ContainerBlock,
  [BlockType.SECTION]: SectionBlock,
  [BlockType.GRID]: GridBlock,
  [BlockType.FLEX_ROW]: FlexBlock,
  [BlockType.FLEX_COLUMN]: FlexBlock,
  [BlockType.DYNAMIC]: DynamicBlock,
  [BlockType.CAROUSEL]: CarouselBlock,
  [BlockType.PRODUCT_LIST]: ProductListBlock,
  [BlockType.PRODUCT_DETAIL]: ProductDetailBlock,
  [BlockType.VIDEO]: VideoBlock,
};

/**
 * Block loading skeleton
 */
export const BlockSkeleton: React.FC<{ height?: string }> = ({ height = '200px' }) => (
  <div className="animate-pulse bg-gray-200 rounded" style={{ height }} />
);

/**
 * Get block component by type
 * Returns lazy-loaded component or placeholder
 */
export function getBlockComponent(blockType: BlockType | string) {
  return LAZY_BLOCK_COMPONENTS[blockType] || null;
}

/**
 * Block Loader Component Props
 */
export interface BlockLoaderProps {
  blockType: BlockType | string;
  blockId: string;
  props: any;
  skeletonHeight?: string;
}

/**
 * Block Loader Component
 * Handles lazy loading, suspense, and error boundaries for blocks
 */
export const BlockLoader: React.FC<BlockLoaderProps> = ({
  blockType,
  blockId,
  props,
  skeletonHeight = '200px',
}) => {
  const Component = getBlockComponent(blockType);

  if (!Component) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-600 rounded">
        Unknown block type: {blockType}
      </div>
    );
  }

  return (
    <BlockErrorBoundary blockId={blockId}>
      <Suspense fallback={<BlockSkeleton height={skeletonHeight} />}>
        <Component {...props} />
      </Suspense>
    </BlockErrorBoundary>
  );
};

export default BlockLoader;
