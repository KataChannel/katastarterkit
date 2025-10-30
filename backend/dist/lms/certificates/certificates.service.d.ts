import { PrismaService } from '../../prisma/prisma.service';
export declare class CertificatesService {
    private prisma;
    constructor(prisma: PrismaService);
    generateCertificate(enrollmentId: string, userId: string): Promise<{
        id: string;
        enrollmentId: string;
        certificateNumber: string;
        userId: string;
        courseId: string;
        issueDate: Date;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMyCertificates(userId: string): Promise<({
        course: {
            title: string;
            slug: string;
            thumbnail: string;
        };
    } & {
        id: string;
        enrollmentId: string;
        certificateNumber: string;
        userId: string;
        courseId: string;
        issueDate: Date;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getCertificate(id: string, userId: string): Promise<{
        user: {
            username: string;
            firstName: string;
            lastName: string;
        };
        course: {
            title: string;
            slug: string;
            thumbnail: string;
            duration: number;
        };
    } & {
        id: string;
        enrollmentId: string;
        certificateNumber: string;
        userId: string;
        courseId: string;
        issueDate: Date;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    verifyCertificate(certificateNumber: string): Promise<{
        valid: boolean;
        certificate: {
            user: {
                username: string;
                firstName: string;
                lastName: string;
            };
            course: {
                title: string;
                thumbnail: string;
            };
        } & {
            id: string;
            enrollmentId: string;
            certificateNumber: string;
            userId: string;
            courseId: string;
            issueDate: Date;
            courseName: string;
            instructorName: string;
            completionDate: Date;
            grade: string | null;
            verificationUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    private generateCertificateNumber;
    getCertificateStats(userId: string): Promise<{
        total: number;
        thisMonth: number;
        thisYear: number;
    }>;
}
