import { CertificatesService } from './certificates.service';
export declare class CertificatesResolver {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    generateCertificate(user: any, enrollmentId: string): Promise<{
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
    getMyCertificates(user: any): Promise<({
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
    getCertificate(user: any, id: string): Promise<{
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
    getCertificateStats(user: any): Promise<{
        total: number;
        thisMonth: number;
        thisYear: number;
    }>;
}
