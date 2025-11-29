/**
 * OptimizedImage Component
 * Wrapper around Next.js Image with automatic URL normalization
 */

import Image, { ImageProps } from 'next/image';
import { normalizeImageUrl, shouldDisableOptimization } from '@/utils/image-url';

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
  // Normalize and validate src
  const normalizedSrc = normalizeImageUrl(src) || fallback;
  
  // Check if optimization should be disabled
  const unoptimized = shouldDisableOptimization(src) || props.unoptimized;
  
  return (
    <Image
      {...props}
      src={normalizedSrc}
      alt={alt || 'Image'}
      unoptimized={unoptimized}
      onError={(e) => {
        // Fallback on error
        const target = e.target as HTMLImageElement;
        if (target.src !== fallback) {
          target.src = fallback;
        }
        props.onError?.(e);
      }}
    />
  );
}

export default OptimizedImage;
