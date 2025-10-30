import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SupportAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDailyStats(date: Date) {
    return this.prisma.supportAnalytics.findFirst({
      where: { date },
    });
  }

  async getAgentStats(agentId: string, startDate: Date, endDate: Date) {
    return this.prisma.supportAnalytics.findMany({
      where: {
        agentId,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'desc' },
    });
  }
}
