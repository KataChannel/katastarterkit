import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

interface AIAnalysisResult {
  summary: string;
  keywords: string[];
  topics: string[];
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY not configured. AI analysis features will be disabled.');
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    this.logger.log('Gemini AI service initialized');
  }

  async analyzeDocument(content: string, type: string): Promise<AIAnalysisResult> {
    if (!this.model) {
      throw new Error('Gemini AI not configured');
    }

    try {
      const prompt = this.buildAnalysisPrompt(content, type);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAnalysisResponse(text);
    } catch (error) {
      this.logger.error('Error analyzing document with Gemini:', error);
      throw new Error('Failed to analyze document');
    }
  }

  async summarizeText(text: string, maxLength: number = 500): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini AI not configured');
    }

    try {
      const prompt = `Summarize the following text in Vietnamese (maximum ${maxLength} characters):\n\n${text}`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error('Error summarizing text:', error);
      throw new Error('Failed to summarize text');
    }
  }

  async extractKeywords(text: string, count: number = 10): Promise<string[]> {
    if (!this.model) {
      throw new Error('Gemini AI not configured');
    }

    try {
      const prompt = `Extract ${count} most important keywords from the following text. Return only the keywords separated by commas:\n\n${text}`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const keywords = response.text().split(',').map((k) => k.trim()).filter(Boolean);
      return keywords.slice(0, count);
    } catch (error) {
      this.logger.error('Error extracting keywords:', error);
      throw new Error('Failed to extract keywords');
    }
  }

  async identifyTopics(text: string, count: number = 5): Promise<string[]> {
    if (!this.model) {
      throw new Error('Gemini AI not configured');
    }

    try {
      const prompt = `Identify ${count} main topics/themes from the following text. Return only the topics separated by commas:\n\n${text}`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const topics = response.text().split(',').map((t) => t.trim()).filter(Boolean);
      return topics.slice(0, count);
    } catch (error) {
      this.logger.error('Error identifying topics:', error);
      throw new Error('Failed to identify topics');
    }
  }

  async analyzeVideoTranscript(transcript: string): Promise<AIAnalysisResult> {
    return this.analyzeDocument(transcript, 'VIDEO');
  }

  async analyzeAudioTranscript(transcript: string): Promise<AIAnalysisResult> {
    return this.analyzeDocument(transcript, 'AUDIO');
  }

  private buildAnalysisPrompt(content: string, type: string): string {
    return `Analyze the following ${type} content and provide:
1. A comprehensive summary (in Vietnamese, 200-300 words)
2. 10 most important keywords
3. 5 main topics/themes

Content:
${content}

Please format your response as JSON with the following structure:
{
  "summary": "...",
  "keywords": ["...", "...", ...],
  "topics": ["...", "...", ...]
}`;
  }

  private parseAnalysisResponse(text: string): AIAnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || '',
          keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
          topics: Array.isArray(parsed.topics) ? parsed.topics : [],
        };
      }

      // Fallback: manual parsing
      this.logger.warn('Failed to parse JSON response, using fallback parsing');
      return this.fallbackParse(text);
    } catch (error) {
      this.logger.error('Error parsing analysis response:', error);
      return this.fallbackParse(text);
    }
  }

  private fallbackParse(text: string): AIAnalysisResult {
    const lines = text.split('\n').filter(Boolean);
    let summary = '';
    const keywords: string[] = [];
    const topics: string[] = [];

    let currentSection = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.toLowerCase().includes('summary') || trimmed.toLowerCase().includes('tóm tắt')) {
        currentSection = 'summary';
        continue;
      }
      if (trimmed.toLowerCase().includes('keyword') || trimmed.toLowerCase().includes('từ khóa')) {
        currentSection = 'keywords';
        continue;
      }
      if (trimmed.toLowerCase().includes('topic') || trimmed.toLowerCase().includes('chủ đề')) {
        currentSection = 'topics';
        continue;
      }

      if (currentSection === 'summary' && trimmed) {
        summary += trimmed + ' ';
      } else if (currentSection === 'keywords' && trimmed) {
        keywords.push(...trimmed.split(',').map((k) => k.trim()).filter(Boolean));
      } else if (currentSection === 'topics' && trimmed) {
        topics.push(...trimmed.split(',').map((t) => t.trim()).filter(Boolean));
      }
    }

    return {
      summary: summary.trim() || 'Unable to generate summary',
      keywords: keywords.slice(0, 10),
      topics: topics.slice(0, 5),
    };
  }

  // ============== Educational Content Analysis ==============

  async analyzeLearningMaterial(content: string): Promise<{
    difficulty: string;
    prerequisites: string[];
    learningObjectives: string[];
    estimatedTime: string;
  }> {
    if (!this.model) {
      throw new Error('Gemini AI not configured');
    }

    try {
      const prompt = `Analyze the following educational content and provide:
1. Difficulty level (Beginner/Intermediate/Advanced)
2. Prerequisites (list of required knowledge)
3. Learning objectives (what students will learn)
4. Estimated learning time

Content:
${content}

Format as JSON:
{
  "difficulty": "...",
  "prerequisites": ["...", ...],
  "learningObjectives": ["...", ...],
  "estimatedTime": "..."
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Failed to parse learning material analysis');
    } catch (error) {
      this.logger.error('Error analyzing learning material:', error);
      throw new Error('Failed to analyze learning material');
    }
  }

  async generateQuizQuestions(content: string, count: number = 5): Promise<any[]> {
    if (!this.model) {
      throw new Error('Gemini AI not configured');
    }

    try {
      const prompt = `Generate ${count} multiple-choice quiz questions based on the following content. Each question should have 4 options with one correct answer.

Content:
${content}

Format as JSON array:
[
  {
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": 0,
    "explanation": "..."
  },
  ...
]`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Failed to parse quiz questions');
    } catch (error) {
      this.logger.error('Error generating quiz questions:', error);
      throw new Error('Failed to generate quiz questions');
    }
  }

  // ============== E-commerce Content Generation ==============

  /**
   * Tạo mô tả cho danh mục sản phẩm
   */
  async generateCategoryDescription(categoryName: string, context?: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini AI not configured');
    }

    try {
      const prompt = `Bạn là chuyên gia marketing cho cửa hàng rau sạch. Hãy viết một mô tả ngắn gọn, hấp dẫn cho danh mục "${categoryName}" trong tiếng Việt.

${context ? `Thông tin thêm: ${context}` : ''}

Yêu cầu:
- Mô tả từ 50-100 từ
- Nhấn mạnh tính tươi ngon, sạch, an toàn
- Phù hợp cho cửa hàng rau sạch
- Không dùng các cụm từ quá phóng đại
- Giọng văn thân thiện, gần gũi

Chỉ trả về đoạn mô tả, không giải thích thêm.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      this.logger.error('Error generating category description:', error);
      throw new Error('Không thể tạo mô tả. Vui lòng thử lại.');
    }
  }

  /**
   * Tạo mô tả cho sản phẩm
   */
  async generateProductDescription(productName: string, categoryName?: string, context?: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini AI not configured');
    }

    try {
      const prompt = `Bạn là chuyên gia marketing cho cửa hàng rau sạch. Hãy viết mô tả sản phẩm "${productName}"${categoryName ? ` thuộc danh mục "${categoryName}"` : ''} bằng tiếng Việt.

${context ? `Thông tin thêm: ${context}` : ''}

Yêu cầu:
- Mô tả từ 80-150 từ
- Nêu bật đặc điểm, lợi ích sức khỏe
- Nhấn mạnh tính tươi ngon, sạch, an toàn
- Gợi ý cách sử dụng/chế biến nếu phù hợp
- Giọng văn thân thiện, gần gũi

Chỉ trả về đoạn mô tả, không giải thích thêm.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      this.logger.error('Error generating product description:', error);
      throw new Error('Không thể tạo mô tả. Vui lòng thử lại.');
    }
  }

  /**
   * Tạo prompt để generate hình ảnh từ tên danh mục/sản phẩm
   */
  async generateImagePrompt(name: string, type: 'category' | 'product' = 'product'): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini AI not configured');
    }

    try {
      const prompt = `Tạo một prompt bằng tiếng Anh để generate hình ảnh cho ${type === 'category' ? 'danh mục' : 'sản phẩm'} "${name}" của cửa hàng rau sạch.

Yêu cầu cho prompt:
- Phong cách: ảnh chụp sản phẩm chuyên nghiệp, nền trắng hoặc tự nhiên
- Ánh sáng: sáng, tự nhiên
- Chất lượng: cao, chi tiết
- Màu sắc: tươi sáng, tự nhiên
- Không có chữ, logo, watermark

Chỉ trả về prompt bằng tiếng Anh, không giải thích thêm. Prompt nên ngắn gọn (dưới 100 từ).`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      this.logger.error('Error generating image prompt:', error);
      throw new Error('Không thể tạo prompt. Vui lòng thử lại.');
    }
  }

  /**
   * Kiểm tra xem service đã được cấu hình chưa
   */
  isConfigured(): boolean {
    return !!this.model;
  }
}
