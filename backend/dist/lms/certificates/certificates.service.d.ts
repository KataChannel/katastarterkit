import { PrismaService } from '../../prisma/prisma.service';
export declare class CertificatesService {
    private prisma;
    constructor(prisma: PrismaService);
    generateCertificate(enrollmentId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        userId: string;
        issueDate: Date;
        enrollmentId: string;
        certificateNumber: string;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
    }>;
    getMyCertificates(userId: string): Promise<({
        course: {
            slug: string;
            title: string;
            thumbnail: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        userId: string;
        issueDate: Date;
        enrollmentId: string;
        certificateNumber: string;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
    })[]>;
    getCertificate(id: string, userId: string): Promise<{
        course: {
            slug: string;
            title: string;
            thumbnail: string;
            duration: number;
        };
        user: {
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        userId: string;
        issueDate: Date;
        enrollmentId: string;
        certificateNumber: string;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
    }>;
    verifyCertificate(certificateNumber: string): Promise<{
        valid: boolean;
        certificate: {
            course: {
                title: string;
                thumbnail: string;
            };
            user: {
                username: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            userId: string;
            issueDate: Date;
            enrollmentId: string;
            certificateNumber: string;
            courseName: string;
            instructorName: string;
            completionDate: Date;
            grade: string | null;
            verificationUrl: string | null;
        };
    }>;
    private generateCertificateNumber;
    getCertificateStats(userId: string): Promise<{
        total: number;
        thisMonth: number;
        thisYear: number;
    }>;
}
