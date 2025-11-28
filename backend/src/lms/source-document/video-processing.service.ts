import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export interface VideoProcessingResult {
  success: boolean;
  processedBuffer?: Buffer;
  duration?: number;
  width?: number;
  height?: number;
  error?: string;
  needsProcessing: boolean;
}

@Injectable()
export class VideoProcessingService {
  private readonly logger = new Logger(VideoProcessingService.name);
  private ffmpegAvailable: boolean = false;

  constructor(private readonly configService: ConfigService) {
    this.checkFFmpegAvailability();
  }

  /**
   * Check if FFmpeg is available
   */
  private async checkFFmpegAvailability() {
    try {
      await execAsync('ffmpeg -version');
      this.ffmpegAvailable = true;
      this.logger.log('✅ FFmpeg is available');
    } catch (error) {
      this.ffmpegAvailable = false;
      this.logger.warn('⚠️ FFmpeg not available - video processing disabled');
      this.logger.warn('Install FFmpeg: sudo apt install ffmpeg');
    }
  }

  /**
   * Process video file to optimize for web streaming
   * - Re-encode to H.264 + AAC
   * - Move moov atom to beginning (faststart)
   * - Fix pixel format
   * - Extract metadata (duration, dimensions)
   */
  async processVideo(
    videoBuffer: Buffer,
    originalFileName: string,
  ): Promise<VideoProcessingResult> {
    if (!this.ffmpegAvailable) {
      this.logger.warn('FFmpeg not available, skipping video processing');
      return {
        success: false,
        needsProcessing: true,
        error: 'FFmpeg not installed',
      };
    }

    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `input_${Date.now()}_${originalFileName}`);
    const outputPath = path.join(tempDir, `output_${Date.now()}.mp4`);

    try {
      // Write buffer to temp file
      await fs.promises.writeFile(inputPath, videoBuffer);

      // First, probe the video to get metadata
      const probeResult = await this.probeVideo(inputPath);
      
      // Check if video needs processing
      const needsProcessing = this.needsProcessing(probeResult);
      
      if (!needsProcessing) {
        this.logger.log(`Video already optimized: ${originalFileName}`);
        
        // Clean up
        await this.cleanupFiles([inputPath]);
        
        return {
          success: true,
          processedBuffer: videoBuffer,
          duration: probeResult.duration,
          width: probeResult.width,
          height: probeResult.height,
          needsProcessing: false,
        };
      }

      this.logger.log(`Processing video: ${originalFileName}`);
      this.logger.log(`  Original: codec=${probeResult.videoCodec}, format=${probeResult.format}`);

      // Re-encode video for web optimization
      const ffmpegCommand = [
        'ffmpeg',
        '-i', `"${inputPath}"`,
        '-c:v libx264',           // H.264 video codec
        '-preset medium',          // Encoding speed/quality trade-off
        '-crf 23',                 // Constant Rate Factor (quality: 18-28)
        '-movflags +faststart',    // Move moov atom to beginning
        '-c:a aac',                // AAC audio codec
        '-b:a 128k',               // Audio bitrate
        '-pix_fmt yuv420p',        // Pixel format for web
        '-vf "scale=trunc(iw/2)*2:trunc(ih/2)*2"', // Ensure even dimensions
        '-y',                      // Overwrite output
        `"${outputPath}"`,
      ].join(' ');

      this.logger.log(`Running: ${ffmpegCommand.substring(0, 100)}...`);

      const { stdout, stderr } = await execAsync(ffmpegCommand, {
        maxBuffer: 50 * 1024 * 1024, // 50MB buffer
        timeout: 5 * 60 * 1000, // 5 minutes timeout
      });

      // Check if output file was created
      if (!fs.existsSync(outputPath)) {
        throw new Error('FFmpeg failed to create output file');
      }

      // Read processed video
      const processedBuffer = await fs.promises.readFile(outputPath);

      // Get final metadata
      const finalProbe = await this.probeVideo(outputPath);

      this.logger.log(`✅ Video processed successfully: ${originalFileName}`);
      this.logger.log(`  Processed: codec=${finalProbe.videoCodec}, size=${Math.round(processedBuffer.length / 1024 / 1024)}MB`);
      this.logger.log(`  Duration: ${finalProbe.duration}s, Size: ${finalProbe.width}x${finalProbe.height}`);

      // Clean up temp files
      await this.cleanupFiles([inputPath, outputPath]);

      return {
        success: true,
        processedBuffer,
        duration: finalProbe.duration,
        width: finalProbe.width,
        height: finalProbe.height,
        needsProcessing: true,
      };
    } catch (error) {
      this.logger.error(`Video processing failed: ${error.message}`);
      
      // Clean up on error
      await this.cleanupFiles([inputPath, outputPath]);
      
      return {
        success: false,
        needsProcessing: true,
        error: error.message,
      };
    }
  }

  /**
   * Probe video to get metadata
   */
  private async probeVideo(filePath: string): Promise<any> {
    try {
      const command = `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`;
      const { stdout } = await execAsync(command);
      const metadata = JSON.parse(stdout);

      const videoStream = metadata.streams?.find((s: any) => s.codec_type === 'video');
      const audioStream = metadata.streams?.find((s: any) => s.codec_type === 'audio');

      return {
        duration: parseFloat(metadata.format?.duration || '0'),
        format: metadata.format?.format_name,
        videoCodec: videoStream?.codec_name,
        audioCodec: audioStream?.codec_name,
        width: videoStream?.width,
        height: videoStream?.height,
        pixelFormat: videoStream?.pix_fmt,
        hasFaststart: metadata.format?.format_name?.includes('mp4'),
      };
    } catch (error) {
      this.logger.error(`Video probe failed: ${error.message}`);
      return {
        duration: null,
        format: null,
        videoCodec: null,
        audioCodec: null,
        width: null,
        height: null,
        pixelFormat: null,
        hasFaststart: false,
      };
    }
  }

  /**
   * Determine if video needs processing
   */
  private needsProcessing(probeResult: any): boolean {
    // Always process if we can't determine codec
    if (!probeResult.videoCodec) {
      return true;
    }

    // Check if video is already H.264 + AAC with proper format
    const isOptimal =
      probeResult.videoCodec === 'h264' &&
      probeResult.audioCodec === 'aac' &&
      probeResult.pixelFormat === 'yuv420p' &&
      probeResult.format?.includes('mp4');

    return !isOptimal;
  }

  /**
   * Extract video thumbnail
   */
  async extractThumbnail(
    videoBuffer: Buffer,
    timeInSeconds: number = 1,
  ): Promise<Buffer | null> {
    if (!this.ffmpegAvailable) {
      return null;
    }

    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `input_${Date.now()}.mp4`);
    const outputPath = path.join(tempDir, `thumb_${Date.now()}.jpg`);

    try {
      // Write buffer to temp file
      await fs.promises.writeFile(inputPath, videoBuffer);

      // Extract frame at specified time
      const command = [
        'ffmpeg',
        '-i', `"${inputPath}"`,
        '-ss', timeInSeconds.toString(),
        '-vframes 1',
        '-q:v 2',
        '-y',
        `"${outputPath}"`,
      ].join(' ');

      await execAsync(command, { timeout: 30000 });

      if (!fs.existsSync(outputPath)) {
        throw new Error('Failed to extract thumbnail');
      }

      const thumbnailBuffer = await fs.promises.readFile(outputPath);

      // Clean up
      await this.cleanupFiles([inputPath, outputPath]);

      return thumbnailBuffer;
    } catch (error) {
      this.logger.error(`Thumbnail extraction failed: ${error.message}`);
      await this.cleanupFiles([inputPath, outputPath]);
      return null;
    }
  }

  /**
   * Clean up temporary files
   */
  private async cleanupFiles(filePaths: string[]) {
    for (const filePath of filePaths) {
      try {
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      } catch (error) {
        this.logger.warn(`Failed to cleanup file ${filePath}: ${error.message}`);
      }
    }
  }

  /**
   * Get FFmpeg availability status
   */
  isFFmpegAvailable(): boolean {
    return this.ffmpegAvailable;
  }
}
