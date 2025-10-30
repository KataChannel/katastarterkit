import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SupportConversationService } from '../services/support-conversation.service';

@Resolver('SupportConversation')
export class SupportConversationResolver {
  constructor(private conversationService: SupportConversationService) {}

  @Query()
  async supportConversations(@Args('where') where?: any, @Args('take') take?: number) {
    return this.conversationService.findAll({ where, take });
  }

  @Query()
  async supportConversation(@Args('id') id: string) {
    return this.conversationService.findOne(id);
  }

  @Mutation()
  async createSupportConversation(@Args('input') input: any) {
    return this.conversationService.createConversation(input);
  }

  @Mutation()
  async assignConversationToAgent(
    @Args('conversationId') conversationId: string,
    @Args('agentId') agentId: string,
  ) {
    return this.conversationService.assignToAgent(conversationId, agentId);
  }
}
