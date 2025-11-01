import { PrismaService } from '../../prisma/prisma.service';
export declare class EnrollmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    enroll(userId: string, courseId: string): Promise<any>;
    getMyEnrollments(userId: string): Promise<any>;
    getEnrollment(userId: string, courseId: string): Promise<any>;
    updateProgress(userId: string, courseId: string): Promise<any>;
    dropCourse(userId: string, courseId: string): Promise<any>;
    getCourseEnrollments(courseId: string, instructorId?: string): Promise<any>;
    markLessonComplete(userId: string, enrollmentId: string, lessonId: string): Promise<any>;
    private updateEnrollmentProgress;
}
