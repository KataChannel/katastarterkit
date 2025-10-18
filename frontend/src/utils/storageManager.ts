/**
 * Storage Manager with Compression and Quota Management
 * Handles localStorage quota limits with automatic cleanup and compression
 */

// Simple compression using LZ-String-like algorithm
export class StorageManager {
  private static readonly MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB (typical localStorage limit)
  private static readonly WARNING_THRESHOLD = 0.8; // Warn at 80% full
  private static readonly CLEANUP_THRESHOLD = 0.9; // Auto cleanup at 90% full

  /**
   * Compress a string using simple run-length encoding and base64
   */
  private static compress(str: string): string {
    try {
      // Simple compression: JSON -> base64
      // For better compression, could use LZ-String library
      return btoa(encodeURIComponent(str));
    } catch (error) {
      console.warn('Compression failed, using original:', error);
      return str;
    }
  }

  /**
   * Decompress a string
   */
  private static decompress(str: string): string {
    try {
      return decodeURIComponent(atob(str));
    } catch (error) {
      // If decompression fails, assume it's not compressed
      return str;
    }
  }

  /**
   * Get current localStorage usage
   */
  static getStorageUsage(): {
    used: number;
    available: number;
    percentage: number;
    isNearLimit: boolean;
  } {
    let used = 0;
    
    try {
      // Calculate total size of all localStorage items
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += (localStorage[key].length + key.length) * 2; // UTF-16 chars = 2 bytes each
        }
      }
    } catch (error) {
      console.error('Error calculating storage usage:', error);
    }

    const available = this.MAX_STORAGE_SIZE - used;
    const percentage = (used / this.MAX_STORAGE_SIZE) * 100;
    const isNearLimit = percentage >= (this.WARNING_THRESHOLD * 100);

    return { used, available, percentage, isNearLimit };
  }

  /**
   * Set item with compression and quota management
   */
  static setItem(key: string, value: any, options: {
    compress?: boolean;
    autoCleanup?: boolean;
  } = {}): boolean {
    const { compress = true, autoCleanup = true } = options;

    try {
      const jsonString = JSON.stringify(value);
      const dataToStore = compress ? this.compress(jsonString) : jsonString;
      
      // Add metadata for cleanup decisions
      const itemWithMeta = JSON.stringify({
        data: dataToStore,
        compressed: compress,
        timestamp: Date.now(),
        size: dataToStore.length,
      });

      // Check storage before writing
      const usage = this.getStorageUsage();
      const itemSize = (itemWithMeta.length + key.length) * 2;

      // If near limit and auto cleanup enabled, try cleanup
      if (usage.percentage >= (this.CLEANUP_THRESHOLD * 100) && autoCleanup) {
        console.warn('Storage near limit, attempting cleanup...');
        this.cleanup(key); // Don't cleanup the key we're about to write
      }

      // Try to set the item
      localStorage.setItem(key, itemWithMeta);
      
      // Log warning if storage is getting full
      const newUsage = this.getStorageUsage();
      if (newUsage.isNearLimit) {
        console.warn(`localStorage usage: ${newUsage.percentage.toFixed(1)}%`);
      }

      return true;
    } catch (error: any) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.error('localStorage quota exceeded!');
        
        // Try emergency cleanup
        if (options.autoCleanup) {
          console.warn('Attempting emergency cleanup...');
          this.cleanup(key, true);
          
          // Retry once after cleanup
          try {
            const jsonString = JSON.stringify(value);
            const dataToStore = options.compress ? this.compress(jsonString) : jsonString;
            const itemWithMeta = JSON.stringify({
              data: dataToStore,
              compressed: options.compress,
              timestamp: Date.now(),
              size: dataToStore.length,
            });
            localStorage.setItem(key, itemWithMeta);
            return true;
          } catch (retryError) {
            console.error('Failed to save even after cleanup:', retryError);
            throw new Error('Storage quota exceeded and cleanup failed');
          }
        }
        
        throw new Error('Storage quota exceeded. Please delete some templates or clear browser data.');
      }
      
      console.error('Error setting localStorage item:', error);
      throw error;
    }
  }

  /**
   * Get item with automatic decompression
   */
  static getItem<T = any>(key: string): T | null {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      // Try to parse as metadata object
      try {
        const parsed = JSON.parse(stored);
        
        // New format with metadata
        if (parsed.data !== undefined && parsed.compressed !== undefined) {
          const data = parsed.compressed ? this.decompress(parsed.data) : parsed.data;
          return JSON.parse(data);
        }
        
        // Old format (direct JSON)
        return parsed as T;
      } catch (parseError) {
        // If parsing fails, return as-is
        return stored as any;
      }
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return null;
    }
  }

  /**
   * Remove item
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage item:', error);
    }
  }

  /**
   * Cleanup old items to free space
   */
  static cleanup(protectedKey?: string, aggressive: boolean = false): number {
    try {
      const items: { key: string; timestamp: number; size: number }[] = [];

      // Collect all items with timestamps
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key !== protectedKey) {
          try {
            const stored = localStorage.getItem(key);
            if (!stored) continue;

            const parsed = JSON.parse(stored);
            if (parsed.timestamp && parsed.size) {
              items.push({
                key,
                timestamp: parsed.timestamp,
                size: parsed.size,
              });
            }
          } catch (e) {
            // Skip items that don't have metadata
          }
        }
      }

      // Sort by timestamp (oldest first)
      items.sort((a, b) => a.timestamp - b.timestamp);

      let freedSpace = 0;
      const targetPercentage = aggressive ? 0.5 : 0.7; // Free to 50% or 70%
      const usage = this.getStorageUsage();

      // Remove oldest items until we reach target
      for (const item of items) {
        if (usage.percentage <= (targetPercentage * 100)) {
          break;
        }

        localStorage.removeItem(item.key);
        freedSpace += item.size;
        
        // Recalculate usage
        const newUsage = this.getStorageUsage();
        if (newUsage.percentage <= (targetPercentage * 100)) {
          break;
        }
      }

      if (freedSpace > 0) {
        console.log(`Cleaned up ${freedSpace} bytes (${items.length} items)`);
      }

      return freedSpace;
    } catch (error) {
      console.error('Error during cleanup:', error);
      return 0;
    }
  }

  /**
   * Get storage statistics
   */
  static getStats(): {
    usage: ReturnType<typeof StorageManager.getStorageUsage>;
    itemCount: number;
    items: Array<{ key: string; size: number; timestamp?: number }>;
  } {
    const usage = this.getStorageUsage();
    const items: Array<{ key: string; size: number; timestamp?: number }> = [];

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const stored = localStorage.getItem(key) || '';
        const size = (stored.length + key.length) * 2;
        
        let timestamp: number | undefined;
        try {
          const parsed = JSON.parse(stored);
          timestamp = parsed.timestamp;
        } catch (e) {
          // No timestamp available
        }

        items.push({ key, size, timestamp });
      }
    }

    // Sort by size (largest first)
    items.sort((a, b) => b.size - a.size);

    return {
      usage,
      itemCount: items.length,
      items,
    };
  }

  /**
   * Clear all storage (use with caution!)
   */
  static clearAll(): void {
    try {
      localStorage.clear();
      console.log('localStorage cleared');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Format bytes to human readable string
   */
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

export default StorageManager;
