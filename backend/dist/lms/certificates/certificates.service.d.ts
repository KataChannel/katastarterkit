import { PrismaService } from '../../prisma/prisma.service';
export declare class CertificatesService {
    private prisma;
    constructor(prisma: PrismaService);
    generateCertificate(enrollmentId: string, userId: string): Promise<{
        id: string;
        updatedAt: Date;
        createdAt: Date;
        userId: string;
        issueDate: Date;
        enrollmentId: string;
        certificateNumber: string;
        courseId: string;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        grade: string | null;
        verificationUrl: string | null;
    }>;
    getMyCertificates(userId: string): Promise<({
        course: {
            title: string;
            slug: string;
            thumbnail: string;
        };
    } & {
        id: string;
        updatedAt: Date;
        createdAt: Date;
        userId: string;
        issueDate: Date;
        enrollmentId: string;
        certificateNumber: string;
        courseId: string;
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
            title: string;
            duration: number;
            slug: string;
            thumbnail: string;
        };
    } & {
        id: string;
        updatedAt: Date;
        createdAt: Date;
        userId: string;
        issueDate: Date;
        enrollmentId: string;
        certificateNumber: string;
        courseId: string;
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
                title: string;
                thumbnail: string;
            };
        } & {
            id: string;
            updatedAt: Date;
            createdAt: Date;
            userId: string;
            issueDate: Date;
            enrollmentId: string;
            certificateNumber: string;
            courseId: string;
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
