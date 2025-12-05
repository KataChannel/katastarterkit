import { Controller, Post, Body, Get, BadRequestException, Logger } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { MinioService } from '../minio/minio.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface GenerateDescriptionDto {
  name: string;
  type: 'category' | 'product';
  categoryName?: string;
  context?: string;
}

interface GenerateImageDto {
  name: string;
  type: 'category' | 'product';
}

interface GenerateImageResult {
  url: string;
  prompt: string;
}

@Controller('ai/ecommerce')
export class AiEcommerceController {
  private readonly logger = new Logger(AiEcommerceController.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Kiểm tra trạng thái AI service
   * GET /ai/ecommerce/status
   */
  @Get('status')
  async getStatus() {
    return {
      geminiConfigured: this.geminiService.isConfigured(),
      imageGenerationAvailable: !!this.configService.get('STABILITY_API_KEY') || 
                                !!this.configService.get('REPLICATE_API_TOKEN'),
    };
  }

  /**
   * Tạo mô tả bằng AI
   * POST /ai/ecommerce/generate-description
   */
  @Post('generate-description')
  async generateDescription(@Body() dto: GenerateDescriptionDto): Promise<{ description: string }> {
    if (!dto.name) {
      throw new BadRequestException('Tên không được để trống');
    }

    if (!this.geminiService.isConfigured()) {
      throw new BadRequestException('AI service chưa được cấu hình. Vui lòng liên hệ admin.');
    }

    try {
      let description: string;
      
      if (dto.type === 'category') {
        description = await this.geminiService.generateCategoryDescription(dto.name, dto.context);
      } else {
        description = await this.geminiService.generateProductDescription(
          dto.name, 
          dto.categoryName, 
          dto.context
        );
      }

      return { description };
    } catch (error: any) {
      this.logger.error('Error generating description:', error);
      throw new BadRequestException(error.message || 'Không thể tạo mô tả');
    }
  }

  /**
   * Tạo hình ảnh bằng AI và upload lên MinIO
   * POST /ai/ecommerce/generate-image
   */
  @Post('generate-image')
  async generateImage(@Body() dto: GenerateImageDto): Promise<GenerateImageResult> {
    if (!dto.name) {
      throw new BadRequestException('Tên không được để trống');
    }

    if (!this.geminiService.isConfigured()) {
      throw new BadRequestException('AI service chưa được cấu hình');
    }

    try {
      // 1. Tạo prompt cho hình ảnh
      const imagePrompt = await this.geminiService.generateImagePrompt(dto.name, dto.type);
      this.logger.log(`Generated image prompt: ${imagePrompt}`);

      // 2. Generate hình ảnh sử dụng Stability AI hoặc Replicate
      const imageBuffer = await this.generateImageFromPrompt(imagePrompt);

      // 3. Upload lên MinIO
      const fileName = this.generateFileName(dto.name, dto.type);
      const imageUrl = await this.minioService.uploadFile(
        'categories',
        fileName,
        imageBuffer,
        'image/png'
      );

      return {
        url: imageUrl,
        prompt: imagePrompt,
      };
    } catch (error: any) {
      this.logger.error('Error generating image:', error);
      throw new BadRequestException(error.message || 'Không thể tạo hình ảnh');
    }
  }

  /**
   * Tạo hình ảnh từ prompt sử dụng Stability AI hoặc Replicate
   */
  private async generateImageFromPrompt(prompt: string): Promise<Buffer> {
    // Thử Stability AI trước
    const stabilityApiKey = this.configService.get<string>('STABILITY_API_KEY');
    if (stabilityApiKey) {
      return this.generateWithStabilityAI(prompt, stabilityApiKey);
    }

    // Thử Replicate
    const replicateToken = this.configService.get<string>('REPLICATE_API_TOKEN');
    if (replicateToken) {
      return this.generateWithReplicate(prompt, replicateToken);
    }

    // Fallback: Tạo placeholder image
    this.logger.warn('No image generation API configured, using placeholder');
    return this.generatePlaceholderImage(prompt);
  }

  /**
   * Generate hình ảnh với Stability AI
   */
  private async generateWithStabilityAI(prompt: string, apiKey: string): Promise<Buffer> {
    try {
      const response = await axios.post(
        'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        {
          text_prompts: [
            {
              text: prompt,
              weight: 1,
            },
            {
              text: 'blurry, bad quality, watermark, text, logo',
              weight: -1,
            },
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const image = response.data.artifacts[0];
      return Buffer.from(image.base64, 'base64');
    } catch (error: any) {
      this.logger.error('Stability AI error:', error.response?.data || error.message);
      throw new Error('Lỗi khi tạo hình ảnh với Stability AI');
    }
  }

  /**
   * Generate hình ảnh với Replicate (FLUX)
   */
  private async generateWithReplicate(prompt: string, apiToken: string): Promise<Buffer> {
    try {
      // Tạo prediction
      const createResponse = await axios.post(
        'https://api.replicate.com/v1/predictions',
        {
          version: 'black-forest-labs/flux-schnell', // Hoặc flux-pro
          input: {
            prompt: prompt,
            num_outputs: 1,
            aspect_ratio: '1:1',
            output_format: 'png',
            output_quality: 90,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${apiToken}`,
          },
        }
      );

      // Poll cho kết quả
      let prediction = createResponse.data;
      while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const pollResponse = await axios.get(prediction.urls.get, {
          headers: { Authorization: `Token ${apiToken}` },
        });
        prediction = pollResponse.data;
      }

      if (prediction.status === 'failed') {
        throw new Error(prediction.error || 'Image generation failed');
      }

      // Download hình ảnh
      const imageUrl = prediction.output[0];
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      return Buffer.from(imageResponse.data);
    } catch (error: any) {
      this.logger.error('Replicate error:', error.response?.data || error.message);
      throw new Error('Lỗi khi tạo hình ảnh với Replicate');
    }
  }

  /**
   * Tạo placeholder image (fallback)
   */
  private async generatePlaceholderImage(text: string): Promise<Buffer> {
    // Sử dụng dịch vụ placeholder
    const placeholderUrl = `https://placehold.co/400x400/e8f5e9/2e7d32/png?text=${encodeURIComponent(text.substring(0, 20))}`;
    
    try {
      const response = await axios.get(placeholderUrl, { responseType: 'arraybuffer' });
      return Buffer.from(response.data);
    } catch {
      // Tạo một buffer rỗng nếu không thể lấy placeholder
      throw new Error('Không thể tạo hình ảnh. Vui lòng cấu hình STABILITY_API_KEY hoặc REPLICATE_API_TOKEN');
    }
  }

  /**
   * Tạo tên file từ tên danh mục/sản phẩm
   */
  private generateFileName(name: string, type: string): string {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const timestamp = Date.now();
    return `${type}-${slug}-${timestamp}.png`;
  }
}
