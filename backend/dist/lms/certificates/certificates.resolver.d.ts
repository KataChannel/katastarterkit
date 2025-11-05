import { CertificatesService } from './certificates.service';
export declare class CertificatesResolver {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    generateCertificate(user: any, enrollmentId: string): Promise<{
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
    getMyCertificates(user: any): Promise<({
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
    getCertificate(user: any, id: string): Promise<{
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
    getCertificateStats(user: any): Promise<{
        total: number;
        thisMonth: number;
        thisYear: number;
    }>;
}
