import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GenerateCourseFromPromptInput {
  prompt: string;
  categoryId?: string;
  instructorId: string;
}

@Injectable()
export class AICourseGeneratorService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  GOOGLE_GEMINI_API_KEY not set. AI course generation will not work.');
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
  }

  /**
   * Generate course from AI prompt
   */
  async generateCourseFromPrompt(input: GenerateCourseFromPromptInput) {
    if (!this.model) {
      throw new BadRequestException('AI service is not configured. Please set GOOGLE_GEMINI_API_KEY');
    }

    const { prompt, categoryId, instructorId } = input;

    // Generate course structure using Gemini AI
    const courseStructure = await this.generateCourseStructure(prompt);

    // Create course with modules, lessons, and quizzes
    const course = await this.createCourseFromStructure(
      courseStructure,
      instructorId,
      categoryId
    );

    return course;
  }

  /**
   * Generate course structure using Gemini AI
   */
  private async generateCourseStructure(prompt: string): Promise<any> {
    const systemPrompt = `Bạn là chuyên gia thiết kế khóa học trực tuyến chuyên nghiệp.
Nhiệm vụ: Tạo cấu trúc khóa học chi tiết bằng tiếng Việt từ mô tả của người dùng.

YÊU CẦU:
- Mỗi khóa học có 4-6 modules
- Mỗi module có 4-7 lessons
- Mỗi module có 1 quiz cuối với 5-10 câu hỏi
- Nội dung lesson phải chi tiết, thực tế, dễ hiểu
- Quiz phải có câu hỏi chất lượng với 4 đáp án

QUAN TRỌNG: Trả về JSON hợp lệ theo cấu trúc:
{
  "title": "Tên khóa học",
  "description": "Mô tả chi tiết khóa học (500-1000 ký tự)",
  "level": "BEGINNER|INTERMEDIATE|ADVANCED",
  "duration": 180,
  "price": 0,
  "whatYouWillLearn": ["Kỹ năng 1", "Kỹ năng 2", "..."],
  "requirements": ["Yêu cầu 1", "Yêu cầu 2", "..."],
  "targetAudience": ["Đối tượng 1", "Đối tượng 2", "..."],
  "tags": ["tag1", "tag2", "..."],
  "metaTitle": "SEO title (max 60 ký tự)",
  "metaDescription": "SEO description (max 160 ký tự)",
  "modules": [
    {
      "title": "Tên module",
      "description": "Mô tả module (200-500 ký tự)",
      "order": 0,
      "lessons": [
        {
          "title": "Tên bài học",
          "description": "Mô tả bài học",
          "type": "VIDEO|TEXT|DOCUMENT",
          "content": "Nội dung chi tiết bài học (markdown format, 1000-3000 ký tự)",
          "duration": 15,
          "order": 0,
          "isPreview": false,
          "isFree": false
        }
      ],
      "quiz": {
        "title": "Kiểm tra cuối module",
        "description": "Kiểm tra kiến thức đã học",
        "passingScore": 70,
        "timeLimit": 20,
        "maxAttempts": 3,
        "isRequired": true,
        "questions": [
          {
            "type": "MULTIPLE_CHOICE",
            "question": "Câu hỏi?",
            "points": 10,
            "order": 0,
            "explanation": "Giải thích đáp án",
            "answers": [
              {
                "text": "Đáp án A",
                "isCorrect": false,
                "order": 0
              },
              {
                "text": "Đáp án B",
                "isCorrect": true,
                "order": 1
              },
              {
                "text": "Đáp án C",
                "isCorrect": false,
                "order": 2
              },
              {
                "text": "Đáp án D",
                "isCorrect": false,
                "order": 3
              }
            ]
          }
        ]
      }
    }
  ]
}

Lưu ý:
- Nội dung phải chuyên nghiệp, thực tế
- Lesson content dùng Markdown format
- Duration tính bằng phút
- Mỗi quiz có 5-10 câu hỏi
- Mỗi câu hỏi có 4 đáp án, chỉ 1 đúng
- Points cho mỗi câu: 10 điểm
- Tổng points của quiz = 100`;

    const fullPrompt = `${systemPrompt}\n\nMÔ TẢ KHÓA HỌC:\n${prompt}\n\nTrả về JSON:`;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();

      // Clean response - remove markdown code blocks if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      const courseData = JSON.parse(text);
      return courseData;
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw new BadRequestException('Failed to generate course structure from AI: ' + error.message);
    }
  }

  /**
   * Create course in database from AI-generated structure
   */
  private async createCourseFromStructure(
    structure: any,
    instructorId: string,
    categoryId?: string
  ) {
    const {
      title,
      description,
      level,
      duration,
      price,
      whatYouWillLearn,
      requirements,
      targetAudience,
      tags,
      metaTitle,
      metaDescription,
      modules,
    } = structure;

    // Generate slug
    const baseSlug = this.generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create course with modules, lessons, and quizzes
    const course = await this.prisma.course.create({
      data: {
        title,
        slug,
        description,
        level: level || 'BEGINNER',
        duration: duration || 0,
        price: price || 0,
        status: 'DRAFT',
        whatYouWillLearn: whatYouWillLearn || [],
        requirements: requirements || [],
        targetAudience: targetAudience || [],
        tags: tags || [],
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || description?.substring(0, 160),
        instructorId,
        categoryId: categoryId || null,
        modules: {
          create: modules.map((module: any) => ({
            title: module.title,
            description: module.description,
            order: module.order,
            isPublished: true,
            lessons: {
              create: module.lessons.map((lesson: any) => ({
                title: lesson.title,
                description: lesson.description,
                type: lesson.type || 'TEXT',
                content: lesson.content,
                duration: lesson.duration || 15,
                order: lesson.order,
                isPreview: lesson.isPreview || false,
                isFree: lesson.isFree || false,
              })),
            },
          })),
        },
      },
      include: {
        instructor: true,
        category: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    // Create quizzes for each module
    for (let i = 0; i < modules.length; i++) {
      const moduleData = modules[i];
      const createdModule = course.modules[i];

      if (moduleData.quiz && createdModule.lessons.length > 0) {
        // Get last lesson of module to attach quiz
        const lastLesson = createdModule.lessons[createdModule.lessons.length - 1];

        await this.prisma.quiz.create({
          data: {
            title: moduleData.quiz.title,
            description: moduleData.quiz.description,
            lessonId: lastLesson.id,
            passingScore: moduleData.quiz.passingScore || 70,
            timeLimit: moduleData.quiz.timeLimit || 20,
            maxAttempts: moduleData.quiz.maxAttempts || 3,
            isRequired: moduleData.quiz.isRequired !== false,
            questions: {
              create: moduleData.quiz.questions.map((question: any) => ({
                type: question.type || 'MULTIPLE_CHOICE',
                question: question.question,
                points: question.points || 10,
                order: question.order,
                explanation: question.explanation,
                answers: {
                  create: question.answers.map((answer: any) => ({
                    text: answer.text,
                    isCorrect: answer.isCorrect,
                    order: answer.order,
                  })),
                },
              })),
            },
          },
        });
      }
    }

    // Fetch complete course with quizzes
    return this.prisma.course.findUnique({
      where: { id: course.id },
      include: {
        instructor: true,
        category: true,
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                quizzes: {
                  include: {
                    questions: {
                      include: {
                        answers: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get sample prompts for soft skills courses
   */
  getSamplePrompts(): string[] {
    return [
      'Tạo khóa học "Kỹ năng giao tiếp hiệu quả" cho người mới bắt đầu, bao gồm giao tiếp cá nhân, giao tiếp nhóm, thuyết trình, và xử lý xung đột.',
      'Khóa học "Quản lý thời gian và năng suất" dành cho dân văn phòng, bao gồm lập kế hoạch, ưu tiên công việc, time blocking, và loại bỏ phân tâm.',
      'Tạo khóa học "Tư duy phản biện và giải quyết vấn đề" cho học sinh - sinh viên, bao gồm phân tích logic, ra quyết định, sáng tạo giải pháp.',
      'Khóa học "Lãnh đạo và làm việc nhóm" cho quản lý, bao gồm leadership, động viên đội nhóm, quản lý xung đột, và coaching.',
    ];
  }

  /**
   * Get detailed prompt templates for soft skills
   */
  getPromptTemplates() {
    return [
      {
        title: 'Kỹ năng giao tiếp hiệu quả',
        category: 'Kỹ năng mềm',
        prompt: `Tạo khóa học "Kỹ năng giao tiếp hiệu quả" cho người mới bắt đầu.

Nội dung chính:
- Module 1: Cơ bản về giao tiếp (ngôn ngữ cơ thể, giọng nói, lắng nghe)
- Module 2: Giao tiếp 1-1 (trò chuyện, đàm phán, phản hồi)
- Module 3: Giao tiếp nhóm (họp nhóm, thảo luận, brainstorming)
- Module 4: Thuyết trình (chuẩn bị, slides, speaking, Q&A)
- Module 5: Giao tiếp qua email và chat (writing, tone, etiquette)
- Module 6: Xử lý xung đột và phản đối

Mỗi module có bài tập thực hành và quiz đánh giá.`,
        tags: ['giao tiếp', 'soft skills', 'presentation', 'kỹ năng mềm'],
      },
      {
        title: 'Quản lý thời gian và năng suất',
        category: 'Kỹ năng mềm',
        prompt: `Tạo khóa học "Quản lý thời gian và năng suất" dành cho dân văn phòng.

Nội dung chính:
- Module 1: Nhận thức về thời gian (audit thời gian, time wasters)
- Module 2: Lập kế hoạch hiệu quả (weekly planning, daily planning, review)
- Module 3: Ưu tiên công việc (Eisenhower Matrix, ABC method, MIT)
- Module 4: Time blocking và Deep Work
- Module 5: Loại bỏ phân tâm và procrastination
- Module 6: Công cụ và hệ thống năng suất (GTD, Pomodoro, tools)

Bao gồm templates, checklists, và exercises thực hành.`,
        tags: ['time management', 'productivity', 'planning', 'năng suất'],
      },
      {
        title: 'Tư duy phản biện và giải quyết vấn đề',
        category: 'Kỹ năng mềm',
        prompt: `Tạo khóa học "Tư duy phản biện và giải quyết vấn đề" cho học sinh - sinh viên.

Nội dung chính:
- Module 1: Tư duy logic (reasoning, fallacies, assumptions)
- Module 2: Phân tích vấn đề (root cause, 5 whys, fishbone)
- Module 3: Sáng tạo giải pháp (brainstorming, SCAMPER, lateral thinking)
- Module 4: Ra quyết định (pros-cons, decision matrix, risk assessment)
- Module 5: Tư duy phản biện (evaluate arguments, bias detection)
- Module 6: Áp dụng thực tế (case studies, projects)

Mỗi module có case studies và quiz tình huống.`,
        tags: ['critical thinking', 'problem solving', 'logic', 'tư duy'],
      },
      {
        title: 'Lãnh đạo và làm việc nhóm',
        category: 'Kỹ năng mềm',
        prompt: `Tạo khóa học "Lãnh đạo và làm việc nhóm" cho quản lý và team leader.

Nội dung chính:
- Module 1: Cơ bản về leadership (styles, traits, vs management)
- Module 2: Xây dựng đội nhóm (team building, trust, culture)
- Module 3: Giao việc và ủy quyền (delegation, empowerment)
- Module 4: Động viên và phát triển nhân viên (motivation, feedback, coaching)
- Module 5: Quản lý xung đột trong nhóm (conflict resolution, mediation)
- Module 6: Dẫn dắt thay đổi (change management, resilience)

Bao gồm role-play scenarios, self-assessment, và action plans.`,
        tags: ['leadership', 'teamwork', 'management', 'lãnh đạo'],
      },
    ];
  }

  /**
   * Generate slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
