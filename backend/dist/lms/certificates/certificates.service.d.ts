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
        enrollmentId: string;
        grade: string | null;
        issueDate: Date;
        certificateNumber: string;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        verificationUrl: string | null;
    }>;
    getMyCertificates(userId: string): Promise<({
        course: {
            slug: string;
            thumbnail: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        userId: string;
        enrollmentId: string;
        grade: string | null;
        issueDate: Date;
        certificateNumber: string;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        verificationUrl: string | null;
    })[]>;
    getCertificate(id: string, userId: string): Promise<{
        user: {
            username: string;
            firstName: string;
            lastName: string;
        };
        course: {
            slug: string;
            thumbnail: string;
            title: string;
            duration: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        userId: string;
        enrollmentId: string;
        grade: string | null;
        issueDate: Date;
        certificateNumber: string;
        courseName: string;
        instructorName: string;
        completionDate: Date;
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
            courseId: string;
            userId: string;
            enrollmentId: string;
            grade: string | null;
            issueDate: Date;
            certificateNumber: string;
            courseName: string;
            instructorName: string;
            completionDate: Date;
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
