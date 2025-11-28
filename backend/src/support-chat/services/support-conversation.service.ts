import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  SupportConversationStatus,
  IntegrationPlatform,
  TicketPriority,
  CustomerAuthType,
} from '@prisma/client';
import { SocialAuthService } from './social-auth.service';

@Injectable()
export class SupportConversationService {
  constructor(
    private prisma: PrismaService,
    private socialAuthService: SocialAuthService,
  ) {}

  async createConversation(data: {
    customerId?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerIp?: string;
    platform?: IntegrationPlatform;
    platformUserId?: string;
    platformUserName?: string;
    subject?: string;
  }) {
    return this.prisma.supportConversation.create({
      data: {
        ...data,
        status: SupportConversationStatus.WAITING,
        startedAt: new Date(),
      },
      include: {
        customer: true,
        assignedAgent: true,
      },
    });
  }

  /**
   * Create conversation with authentication
   */
  async createConversationWithAuth(data: {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    authType: CustomerAuthType;
    socialAccessToken?: string;
    platform?: IntegrationPlatform;
    customerIp?: string;
  }) {
    let authData: any = {
      authType: data.authType,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
    };

    // Handle social authentication
    if (
      data.socialAccessToken &&
      ['ZALO', 'FACEBOOK', 'GOOGLE'].includes(data.authType)
    ) {
      let socialResult;
      
      if (data.authType === CustomerAuthType.ZALO) {
        socialResult = await this.socialAuthService.verifyZaloAuth(
          data.socialAccessToken,
        );
      } else if (data.authType === CustomerAuthType.FACEBOOK) {
        socialResult = await this.socialAuthService.verifyFacebookAuth(
          data.socialAccessToken,
        );
      } else if (data.authType === CustomerAuthType.GOOGLE) {
        socialResult = await this.socialAuthService.verifyGoogleAuth(
          data.socialAccessToken,
        );
      }

      if (socialResult) {
        authData = {
          ...authData,
          customerName: socialResult.name,
          customerEmail: socialResult.email || data.customerEmail,
          customerPhone: socialResult.phone || data.customerPhone,
          socialAuthId: socialResult.socialId,
          socialAuthToken: socialResult.accessToken,
          socialAuthData: socialResult.profileData,
          customerIdentifier: this.socialAuthService.generateCustomerIdentifier(
            data.authType,
            socialResult.socialId,
          ),
        };
      }
    } else if (data.authType === CustomerAuthType.PHONE && data.customerPhone) {
      authData.customerIdentifier = this.socialAuthService.generateCustomerIdentifier(
        'PHONE',
        data.customerPhone,
      );
    } else {
      // Guest user
      authData.customerIdentifier = `guest_${Date.now()}`;
    }

    return this.prisma.supportConversation.create({
      data: {
        ...authData,
        platform: data.platform || IntegrationPlatform.WEBSITE,
        customerIp: data.customerIp,
        status: SupportConversationStatus.WAITING,
        startedAt: new Date(),
      },
      include: {
        customer: true,
        assignedAgent: true,
      },
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    const { skip, take, where, orderBy } = params || {};
    
    return this.prisma.supportConversation.findMany({
      skip,
      take: take || 20,
      where,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        assignedAgent: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { sentAt: 'desc' },
        },
      },
    });
  }

  async findOne(id: string) {
    const conversation = await this.prisma.supportConversation.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        assignedAgent: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { sentAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            attachments: true,
          },
        },
        tickets: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async assignToAgent(conversationId: string, agentId: string) {
    // Validate agent exists if agentId is provided
    if (agentId && agentId !== 'unassigned') {
      const agentExists = await this.prisma.user.findUnique({
        where: { id: agentId },
      });
      
      if (!agentExists) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }
    }

    return this.prisma.supportConversation.update({
      where: { id: conversationId },
      data: {
        assignedAgentId: agentId === 'unassigned' ? null : agentId,
        assignedAt: agentId === 'unassigned' ? null : new Date(),
        status: agentId === 'unassigned' 
          ? SupportConversationStatus.WAITING 
          : SupportConversationStatus.ASSIGNED,
      },
      include: {
        customer: true,
        assignedAgent: true,
      },
    });
  }

  async updateStatus(conversationId: string, status: SupportConversationStatus) {
    const updateData: any = { status };
    
    if (status === SupportConversationStatus.CLOSED || 
        status === SupportConversationStatus.RESOLVED) {
      updateData.closedAt = new Date();
    }

    return this.prisma.supportConversation.update({
      where: { id: conversationId },
      data: updateData,
      include: {
        customer: true,
        assignedAgent: true,
      },
    });
  }

  async updatePriority(conversationId: string, priority: TicketPriority) {
    return this.prisma.supportConversation.update({
      where: { id: conversationId },
      data: { priority },
    });
  }

  async addRating(conversationId: string, rating: number, feedback?: string) {
    return this.prisma.supportConversation.update({
      where: { id: conversationId },
      data: { rating, feedback },
    });
  }

  async getActiveConversations(agentId?: string) {
    const where: any = {
      status: {
        in: [
          SupportConversationStatus.ACTIVE,
          SupportConversationStatus.WAITING,
          SupportConversationStatus.ASSIGNED,
        ],
      },
    };

    if (agentId) {
      where.assignedAgentId = agentId;
    }

    return this.findAll({ where });
  }

  async getConversationByCode(conversationCode: string) {
    return this.prisma.supportConversation.findUnique({
      where: { conversationCode },
      include: {
        customer: true,
        assignedAgent: true,
        messages: {
          orderBy: { sentAt: 'asc' },
          include: {
            sender: true,
            attachments: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.supportConversation.delete({
      where: { id },
    });
  }
}
