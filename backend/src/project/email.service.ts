import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Task, User, Project } from '@prisma/client';

// Note: nodemailer will be installed as needed
// For now, email service is a placeholder that logs instead of sending

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

// Helper to get user display name
function getUserDisplayName(user: User): string {
  return user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || user.lastName || user.username || user.email.split('@')[0];
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private isConfigured: boolean = false;

  constructor(private configService: ConfigService) {
    // Email service placeholder - actual implementation requires nodemailer package
    this.logger.log('📧 Email service initialized (placeholder mode)');
  }

  /**
   * Send generic email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    // Placeholder implementation - logs instead of sending
    this.logger.log(`📧 [PLACEHOLDER] Email would be sent to ${options.to}: ${options.subject}`);
    return true;
  }

  /**
   * Send task assignment notification
   */
  async sendTaskAssignmentEmail(
    task: Task,
    assignedUser: User,
    assignedBy: User,
    project?: Project,
  ): Promise<boolean> {
    const userName = getUserDisplayName(assignedUser);
    const assignerName = getUserDisplayName(assignedBy);
    
    this.logger.log(`📧 Task assignment: ${userName} assigned to "${task.title}" by ${assignerName}`);
    return true; // Placeholder
  }

  /**
   * Send task mention notification
   */
  async sendTaskMentionEmail(
    task: Task,
    mentionedUser: User,
    mentionedBy: User,
    content: string,
    project?: Project,
  ): Promise<boolean> {
    const userName = getUserDisplayName(mentionedUser);
    const mentionerName = getUserDisplayName(mentionedBy);
    
    this.logger.log(`📧 Mention: ${userName} mentioned in "${task.title}" by ${mentionerName}`);
    return true; // Placeholder
  }

  /**
   * Send task deadline reminder
   */
  async sendDeadlineReminderEmail(
    task: Task,
    user: User,
    hoursUntilDue: number,
    project?: Project,
  ): Promise<boolean> {
    const userName = getUserDisplayName(user);
    
    this.logger.log(`📧 Deadline reminder: "${task.title}" due in ${hoursUntilDue}h for ${userName}`);
    return true; // Placeholder
  }

  /**
   * Send task completed notification
   */
  async sendTaskCompletedEmail(
    task: Task,
    completedBy: User,
    projectMembers: User[],
    project?: Project,
  ): Promise<boolean> {
    const userName = getUserDisplayName(completedBy);
    
    this.logger.log(`📧 Task completed: "${task.title}" by ${userName}`);
    return true; // Placeholder
  }

  /**
   * Send project chat mention notification
   */
  async sendChatMentionEmail(
    mentionedUser: User,
    mentionedBy: User,
    message: string,
    project: Project,
  ): Promise<boolean> {
    const userName = getUserDisplayName(mentionedUser);
    const mentionerName = getUserDisplayName(mentionedBy);
    
    this.logger.log(`📧 Chat mention: ${userName} in "${project.name}" by ${mentionerName}`);
    return true; // Placeholder
  }

  /**
   * Send daily digest email
   */
  async sendDailyDigestEmail(
    user: User,
    digest: {
      newTasks: number;
      completedTasks: number;
      upcomingDeadlines: Task[];
      mentions: number;
    },
  ): Promise<boolean> {
    const userName = getUserDisplayName(user);
    
    this.logger.log(`📧 Daily digest for ${userName}: ${digest.newTasks} new, ${digest.completedTasks} completed`);
    return true; // Placeholder
  }
}
