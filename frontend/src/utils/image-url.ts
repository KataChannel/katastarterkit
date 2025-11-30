/**
 * Image URL Normalization Utility
 * Fix HTTP → HTTPS redirect issue for rausachtrangia.com
 */

/**
 * Normalize image URL to prevent Next.js Image Optimization errors
 * 
 * Problem: 
 * - HTTP URLs from old site redirect to HTTPS (301)
 * - Next.js Image Optimization doesn't follow redirects
 * - Results in 400 Bad Request
 * 
 * Solution:
 * - Convert HTTP URLs to HTTPS
 * - Normalize paths
 * 
 * @param url - Image URL (can be HTTP or HTTPS)
 * @returns Normalized HTTPS URL
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Already a data URL or blob
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // Convert HTTP to HTTPS for rausachtrangia.com
  if (url.startsWith('http://rausachtrangia.com')) {
    return url.replace('http://', 'https://');
  }
  
  // Convert HTTP to HTTPS for www subdomain
  if (url.startsWith('http://www.rausachtrangia.com')) {
    return url.replace('http://', 'https://');
  }
  
  // Handle relative URLs
  if (url.startsWith('/')) {
    return `https://rausachtrangia.com${url}`;
  }
  
  return url;
}

/**
 * Check if URL needs unoptimized mode
 * Some old paths might still have issues even with HTTPS
 * These paths often contain old/legacy images that may not exist
 * 
 * @param url - Image URL
 * @returns true if image should skip Next.js optimization
 */
export function shouldDisableOptimization(url: string | null | undefined): boolean {
  if (!url) return false;
  
  // Old paths that might have issues or images may not exist
  const problematicPaths = [
    '/quanly/fileman/',
    '/quanly/',
    '/old-site/',
    '/legacy/',
    '/fileman/',
  ];
  
  return problematicPaths.some(path => url.toLowerCase().includes(path.toLowerCase()));
}

/**
 * Check if the URL is from a potentially broken/legacy source
 * These URLs may return 404 and should use fallback
 * 
 * @param url - Image URL
 * @returns true if URL is potentially broken
 */
export function isPotentiallyBrokenUrl(url: string | null | undefined): boolean {
  if (!url) return true;
  
  // Legacy paths that often have missing images
  const legacyPaths = [
    '/quanly/fileman/',
    '/quanly/',
    '/old-site/',
    '/legacy/',
    '/fileman/',
    'Uploads/Images/',  // Old file manager path
  ];
  
  return legacyPaths.some(path => url.toLowerCase().includes(path.toLowerCase()));
}

/**
 * Get optimized image props for Next.js Image component
 * 
 * Usage:
 * ```tsx
 * const imageProps = getOptimizedImageProps(product.image);
 * <Image {...imageProps} width={640} height={480} alt="..." />
 * ```
 */
export function getOptimizedImageProps(url: string | null | undefined) {
  const normalizedUrl = normalizeImageUrl(url);
  const unoptimized = shouldDisableOptimization(url);
  
  return {
    src: normalizedUrl,
    unoptimized,
  };
}

/**
 * Batch normalize image URLs (for API responses)
 */
export function normalizeImageUrls<T extends Record<string, any>>(
  data: T,
  imageFields: (keyof T)[]
): T {
  const normalized = { ...data };
  
  imageFields.forEach(field => {
    if (typeof normalized[field] === 'string') {
      normalized[field] = normalizeImageUrl(normalized[field] as string) as any;
    }
  });
  
  return normalized;
}

/**
 * Normalize image URLs in array of objects
 */
export function normalizeImageUrlsInArray<T extends Record<string, any>>(
  items: T[],
  imageFields: (keyof T)[]
): T[] {
  return items.map(item => normalizeImageUrls(item, imageFields));
}
