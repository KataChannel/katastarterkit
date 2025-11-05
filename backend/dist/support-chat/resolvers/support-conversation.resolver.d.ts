import { SupportConversationService } from '../services/support-conversation.service';
import { CreateSupportConversationInput, SupportConversationWhereInput } from '../dto/support-conversation.input';
export declare class SupportConversationResolver {
    private conversationService;
    constructor(conversationService: SupportConversationService);
    supportConversations(where?: SupportConversationWhereInput, take?: number): Promise<any>;
    supportConversation(id: string): Promise<any>;
    createSupportConversation(input: CreateSupportConversationInput): Promise<any>;
    assignConversationToAgent(conversationId: string, agentId: string): Promise<any>;
}
