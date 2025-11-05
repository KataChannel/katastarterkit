import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatBotRuleService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    matchRule(message: string, platform: string): Promise<any>;
}
