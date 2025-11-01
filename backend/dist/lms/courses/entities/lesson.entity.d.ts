import { LessonType } from '@prisma/client';
export declare class Lesson {
    id: string;
    title: string;
    description?: string;
    type: LessonType;
    content?: string;
    duration?: number;
    order: number;
    moduleId: string;
    isFree: boolean;
    createdAt: Date;
    updatedAt: Date;
}
