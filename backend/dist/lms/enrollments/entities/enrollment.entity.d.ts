import { EnrollmentStatus } from '@prisma/client';
export declare class Enrollment {
    id: string;
    userId: string;
    courseId: string;
    status: EnrollmentStatus;
    progress: number;
    enrolledAt: Date;
    completedAt?: Date;
    expiresAt?: Date;
    lastAccessedAt?: Date;
}
