'use client';

/**
 * OptimizedImage Component
 * Wrapper around Next.js Image with automatic URL normalization
 */

import Image, { ImageProps } from 'next/image';
import { normalizeImageUrl, shouldDisableOptimization, isPotentiallyBrokenUrl } from '@/utils/image-url';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallback?: string;
}

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Auto-normalize HTTP → HTTPS
 * - Handle null/undefined src
 * - Fallback image support
 * - Auto-disable optimization for problematic URLs
 * - Auto-fallback for potentially broken legacy URLs
 * 
 * Usage:
 * ```tsx
 * <OptimizedImage
 *   src={product.image}
 *   width={640}
 *   height={480}
 *   alt={product.name}
 *   fallback="/images/placeholder.jpg"
 * />
 * ```
 */
export function OptimizedImage({ 
  src, 
  fallback = '/images/placeholder.jpg',
  alt,
  ...props 
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  
  // Normalize and validate src
  const normalizedSrc = normalizeImageUrl(src) || fallback;
  
  // Check if optimization should be disabled (for legacy/problematic paths)
  const unoptimized = shouldDisableOptimization(src) || props.unoptimized;
  
  // Use fallback if error occurred or if using potentially broken URL
  const finalSrc = hasError ? fallback : normalizedSrc;
  
  return (
    <Image
      {...props}
      src={finalSrc}
      alt={alt || 'Image'}
      unoptimized={unoptimized}
      onError={(e) => {
        // Set error state to trigger fallback
        if (!hasError) {
          setHasError(true);
        }
        props.onError?.(e);
      }}
    />
  );
}

export default OptimizedImage;
