/**
 * RAG Config Service - Quản lý cấu hình RAG Chatbot
 * Admin có thể thay đổi settings như model, temperature, rate limits...
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface RAGSettings {
  // Model settings
  modelName: string;
  temperature: number;
  maxTokens: number;
  
  // Rate limiting
  rateLimitPerMinute: number;
  rateLimitPerHour: number;
  
  // Feature flags
  enableCache: boolean;
  cacheTTLMinutes: number;
  enableTokenOptimization: boolean;
  
  // Context settings
  maxContextItems: number;
  defaultContextTypes: string[];
  
  // System prompts
  systemPrompt: string;
  welcomeMessage: string;
  
  // Security
  requireAuth: boolean;
  adminOnlyEndpoints: string[];
}

const DEFAULT_SETTINGS: RAGSettings = {
  modelName: 'gemini-2.0-flash',
  temperature: 0.7,
  maxTokens: 2000,
  rateLimitPerMinute: 30,
  rateLimitPerHour: 500,
  enableCache: true,
  cacheTTLMinutes: 5,
  enableTokenOptimization: true,
  maxContextItems: 50,
  defaultContextTypes: ['sanpham', 'donhang', 'khachhang'],
  systemPrompt: 'Bạn là trợ lý AI chuyên về quản lý rau sạch. Hãy trả lời ngắn gọn, chính xác bằng tiếng Việt.',
  welcomeMessage: 'Xin chào! Tôi là trợ lý AI của Rausach. Tôi có thể giúp bạn tra cứu thông tin sản phẩm, đơn hàng, khách hàng, tồn kho và nhiều thông tin khác. Hãy hỏi tôi bất cứ điều gì!',
  requireAuth: false,
  adminOnlyEndpoints: ['clearCache', 'adminClearHistory', 'updateConfig'],
};

@Injectable()
export class RagConfigService implements OnModuleInit {
  private readonly logger = new Logger(RagConfigService.name);
  private settings: RAGSettings = { ...DEFAULT_SETTINGS };
  private initialized = false;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.loadSettings();
  }

  /**
   * Load settings từ database
   */
  async loadSettings(): Promise<void> {
    try {
      const configs = await this.prisma.rAGConfig.findMany({
        where: { isActive: true },
      });

      for (const config of configs) {
        const key = config.key as keyof RAGSettings;
        if (key in this.settings) {
          try {
            switch (config.valueType) {
              case 'number':
                (this.settings as any)[key] = parseFloat(config.value);
                break;
              case 'boolean':
                (this.settings as any)[key] = config.value === 'true';
                break;
              case 'json':
                (this.settings as any)[key] = JSON.parse(config.value);
                break;
              default:
                (this.settings as any)[key] = config.value;
            }
          } catch (e) {
            this.logger.warn(`Failed to parse config ${key}: ${e.message}`);
          }
        }
      }

      this.initialized = true;
      this.logger.log('RAG settings loaded from database');
    } catch (error) {
      this.logger.warn(`Failed to load settings from database, using defaults: ${error.message}`);
      this.initialized = true;
    }
  }

  /**
   * Lấy tất cả settings
   */
  getSettings(): RAGSettings {
    return { ...this.settings };
  }

  /**
   * Lấy một setting cụ thể
   */
  getSetting<K extends keyof RAGSettings>(key: K): RAGSettings[K] {
    return this.settings[key];
  }

  /**
   * Cập nhật một setting (Admin only)
   */
  async updateSetting<K extends keyof RAGSettings>(
    key: K,
    value: RAGSettings[K],
    description?: string,
  ): Promise<void> {
    try {
      const valueType = typeof value === 'number' ? 'number' 
        : typeof value === 'boolean' ? 'boolean'
        : Array.isArray(value) || typeof value === 'object' ? 'json'
        : 'string';

      const stringValue = valueType === 'json' ? JSON.stringify(value) : String(value);

      await this.prisma.rAGConfig.upsert({
        where: { key: key as string },
        update: {
          value: stringValue,
          valueType,
          description,
          updatedAt: new Date(),
        },
        create: {
          key: key as string,
          value: stringValue,
          valueType,
          description,
          category: this.getCategory(key as string),
          isActive: true,
          isSystem: false,
        },
      });

      // Update in-memory
      this.settings[key] = value;
      this.logger.log(`Config updated: ${key} = ${stringValue}`);
    } catch (error) {
      this.logger.error(`Failed to update config ${key}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cập nhật nhiều settings cùng lúc
   */
  async updateSettings(updates: Partial<RAGSettings>): Promise<void> {
    for (const [key, value] of Object.entries(updates)) {
      if (key in DEFAULT_SETTINGS) {
        await this.updateSetting(key as keyof RAGSettings, value as any);
      }
    }
  }

  /**
   * Reset về default settings
   */
  async resetToDefaults(): Promise<void> {
    try {
      // Delete all non-system configs
      await this.prisma.rAGConfig.deleteMany({
        where: { isSystem: false },
      });

      // Reset in-memory
      this.settings = { ...DEFAULT_SETTINGS };
      this.logger.log('RAG settings reset to defaults');
    } catch (error) {
      this.logger.error(`Failed to reset settings: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lấy tất cả configs từ database (for admin panel)
   */
  async getAllConfigs(): Promise<{
    key: string;
    value: any;
    valueType: string;
    description: string | null;
    category: string | null;
    isSystem: boolean;
    updatedAt: Date;
  }[]> {
    try {
      const configs = await this.prisma.rAGConfig.findMany({
        orderBy: [{ category: 'asc' }, { key: 'asc' }],
      });

      return configs.map((config) => ({
        key: config.key,
        value: this.parseValue(config.value, config.valueType),
        valueType: config.valueType,
        description: config.description,
        category: config.category,
        isSystem: config.isSystem,
        updatedAt: config.updatedAt,
      }));
    } catch (error) {
      this.logger.error(`Failed to get all configs: ${error.message}`);
      return [];
    }
  }

  /**
   * Seed default configs vào database
   */
  async seedDefaultConfigs(): Promise<void> {
    try {
      for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
        const exists = await this.prisma.rAGConfig.findUnique({
          where: { key },
        });

        if (!exists) {
          const valueType = typeof value === 'number' ? 'number'
            : typeof value === 'boolean' ? 'boolean'
            : Array.isArray(value) || typeof value === 'object' ? 'json'
            : 'string';

          await this.prisma.rAGConfig.create({
            data: {
              key,
              value: valueType === 'json' ? JSON.stringify(value) : String(value),
              valueType,
              category: this.getCategory(key),
              isActive: true,
              isSystem: true,
            },
          });
        }
      }

      this.logger.log('Default RAG configs seeded');
    } catch (error) {
      this.logger.error(`Failed to seed configs: ${error.message}`);
    }
  }

  private getCategory(key: string): string {
    if (['modelName', 'temperature', 'maxTokens'].includes(key)) return 'model';
    if (['rateLimitPerMinute', 'rateLimitPerHour'].includes(key)) return 'rate_limit';
    if (['enableCache', 'cacheTTLMinutes', 'enableTokenOptimization'].includes(key)) return 'performance';
    if (['maxContextItems', 'defaultContextTypes'].includes(key)) return 'context';
    if (['systemPrompt', 'welcomeMessage'].includes(key)) return 'content';
    if (['requireAuth', 'adminOnlyEndpoints'].includes(key)) return 'security';
    return 'other';
  }

  private parseValue(value: string, valueType: string): any {
    switch (valueType) {
      case 'number':
        return parseFloat(value);
      case 'boolean':
        return value === 'true';
      case 'json':
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      default:
        return value;
    }
  }

  /**
   * Kiểm tra xem endpoint có require admin không
   */
  isAdminOnlyEndpoint(endpoint: string): boolean {
    return this.settings.adminOnlyEndpoints.includes(endpoint);
  }

  /**
   * Kiểm tra xem có require auth không
   */
  isAuthRequired(): boolean {
    return this.settings.requireAuth;
  }
}
