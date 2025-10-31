import { PrismaService } from '../../prisma/prisma.service';
export declare class CertificatesService {
    private prisma;
    constructor(prisma: PrismaService);
    generateCertificate(enrollmentId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string;
        enrollmentId: string;
        certificateNumber: string;
        issueDate: Date;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
    }>;
    getMyCertificates(userId: string): Promise<({
        course: {
            thumbnail: string;
            slug: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string;
        enrollmentId: string;
        certificateNumber: string;
        issueDate: Date;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
    })[]>;
    getCertificate(id: string, userId: string): Promise<{
        user: {
            username: string;
            firstName: string;
            lastName: string;
        };
        course: {
            thumbnail: string;
            slug: string;
            title: string;
            duration: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string;
        enrollmentId: string;
        certificateNumber: string;
        issueDate: Date;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
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
                thumbnail: string;
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            courseId: string;
            enrollmentId: string;
            certificateNumber: string;
            issueDate: Date;
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
