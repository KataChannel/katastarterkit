import { PrismaService } from '../../prisma/prisma.service';
export declare class SupportTicketService {
    private prisma;
    constructor(prisma: PrismaService);
    createTicket(data: any): Promise<any>;
    findAll(params?: any): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
}
