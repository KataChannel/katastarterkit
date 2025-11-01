import { SupportMessageService } from '../services/support-message.service';
import { CreateSupportMessageInput } from '../dto/support-message.input';
export declare class SupportMessageResolver {
    private messageService;
    constructor(messageService: SupportMessageService);
    supportMessages(conversationId: string): Promise<any>;
    sendSupportMessage(input: CreateSupportMessageInput): Promise<any>;
    markMessagesAsRead(conversationId: string, userId: string): Promise<any>;
}
