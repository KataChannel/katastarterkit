import { PrismaService } from '../../prisma/prisma.service';
export declare class CertificatesService {
    private prisma;
    constructor(prisma: PrismaService);
    generateCertificate(enrollmentId: string, userId: string): Promise<any>;
    getMyCertificates(userId: string): Promise<any>;
    getCertificate(id: string, userId: string): Promise<any>;
    verifyCertificate(certificateNumber: string): Promise<{
        valid: boolean;
        certificate: any;
    }>;
    private generateCertificateNumber;
    getCertificateStats(userId: string): Promise<{
        total: any;
        thisMonth: any;
        thisYear: any;
    }>;
}
