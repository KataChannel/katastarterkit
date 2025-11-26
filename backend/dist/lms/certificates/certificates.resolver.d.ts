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
        enrollmentId: string;
        grade: string | null;
        issueDate: Date;
        certificateNumber: string;
        courseName: string;
        instructorName: string;
        completionDate: Date;
        verificationUrl: string | null;
    }>;
    getMyCertificates(user: any): Promise<({
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
    getCertificate(user: any, id: string): Promise<{
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
    getCertificateStats(user: any): Promise<{
        total: number;
        thisMonth: number;
        thisYear: number;
    }>;
}
