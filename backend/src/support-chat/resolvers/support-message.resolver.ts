import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SupportMessageService } from '../services/support-message.service';
import { SupportMessage } from '../entities/support-conversation.entity';
import { CreateSupportMessageInput, MarkMessagesAsReadInput } from '../dto/support-message.input';
import { SupportChatGateway } from '../gateways/support-chat.gateway';

@Resolver(() => SupportMessage)
export class SupportMessageResolver {
  constructor(
    private messageService: SupportMessageService,
    private chatGateway: SupportChatGateway,
  ) {}

  @Query(() => [SupportMessage], { name: 'supportMessages' })
  async supportMessages(
    @Args('conversationId', { type: () => String }) conversationId: string,
  ) {
    return this.messageService.findByConversation(conversationId);
  }

  @Mutation(() => SupportMessage)
  async sendSupportMessage(
    @Args('input', { type: () => CreateSupportMessageInput }) input: CreateSupportMessageInput,
  ) {
    const message = await this.messageService.createMessage(input);
    
    // Broadcast via WebSocket to all clients in the conversation
    this.chatGateway.server
      .to(`conversation_${input.conversationId}`)
      .emit('new_message', message);
    
    return message;
  }

  @Mutation(() => Int)
  async markMessagesAsRead(
    @Args('conversationId', { type: () => String }) conversationId: string,
    @Args('userId', { type: () => String }) userId: string,
  ) {
    const result = await this.messageService.markConversationMessagesAsRead(conversationId, userId);
    return result.count;
  }
}
