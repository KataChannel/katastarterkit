import { CertificatesService } from './certificates.service';
export declare class CertificatesResolver {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    generateCertificate(user: any, enrollmentId: string): Promise<any>;
    getMyCertificates(user: any): Promise<any>;
    getCertificate(user: any, id: string): Promise<any>;
    verifyCertificate(certificateNumber: string): Promise<{
        valid: boolean;
        certificate: any;
    }>;
    getCertificateStats(user: any): Promise<{
        total: any;
        thisMonth: any;
        thisYear: any;
    }>;
}
