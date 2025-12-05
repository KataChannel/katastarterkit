import { Resolver, Query, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleType } from '@prisma/client';
import { CreateWebsiteSettingInput, UpdateWebsiteSettingInput, SettingCategory } from '../dto/website-setting.input';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class WebsiteSetting {
  @Field()
  id: string;

  @Field()
  key: string;

  @Field()
  domain: string;

  @Field()
  label: string;

  @Field({ nullable: true })
  value?: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  type: string;

  @Field()
  category: string;

  @Field({ nullable: true })
  group?: string;

  @Field()
  order: number;

  @Field(() => GraphQLJSON, { nullable: true })
  options?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  validation?: any;

  @Field()
  isActive: boolean;

  @Field()
  isPublic: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  createdBy?: string;

  @Field({ nullable: true })
  updatedBy?: string;
}

@Resolver(() => WebsiteSetting)
export class WebsiteSettingResolver {
  constructor(private prisma: PrismaService) {}

  // Helper to get current domain from env or default
  private getCurrentDomain(): string {
    return process.env.SITE_DOMAIN || process.env.DOMAIN || 'default';
  }

  @Query(() => [WebsiteSetting], { name: 'websiteSettings' })
  async getWebsiteSettings(
    @Args('category', { type: () => SettingCategory, nullable: true }) category?: SettingCategory,
    @Args('group', { nullable: true }) group?: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
    @Args('isPublic', { nullable: true }) isPublic?: boolean,
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<WebsiteSetting[]> {
    const where: any = {};
    // Filter by domain if provided, otherwise get current domain settings
    if (domain) {
      where.domain = domain;
    } else {
      // Get settings for current domain OR default settings
      where.OR = [
        { domain: this.getCurrentDomain() },
        { domain: 'default' },
      ];
    }
    if (category) where.category = category;
    if (group) where.group = group;
    if (typeof isActive === 'boolean') where.isActive = isActive;
    if (typeof isPublic === 'boolean') where.isPublic = isPublic;

    return await this.prisma.websiteSetting.findMany({
      where,
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    }) as WebsiteSetting[];
  }

  @Query(() => [WebsiteSetting], { name: 'publicWebsiteSettings' })
  async getPublicWebsiteSettings(
    @Args('category', { type: () => SettingCategory, nullable: true }) category?: SettingCategory,
    @Args('group', { nullable: true }) group?: string,
    @Args('keys', { type: () => [String], nullable: true }) keys?: string[],
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<WebsiteSetting[]> {
    const where: any = {
      isActive: true,
      isPublic: true,
    };
    // Filter by domain
    if (domain) {
      where.domain = domain;
    } else {
      where.OR = [
        { domain: this.getCurrentDomain() },
        { domain: 'default' },
      ];
    }
    if (category) where.category = category;
    if (group) where.group = group;
    if (keys && keys.length > 0) where.key = { in: keys };

    return await this.prisma.websiteSetting.findMany({
      where,
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    }) as WebsiteSetting[];
  }

  @Query(() => WebsiteSetting, { name: 'websiteSetting', nullable: true })
  async getWebsiteSetting(
    @Args('key') key: string,
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<WebsiteSetting | null> {
    const targetDomain = domain || this.getCurrentDomain();
    // Try to find setting for specific domain first, then fallback to default
    let setting = await this.prisma.websiteSetting.findFirst({
      where: { key, domain: targetDomain },
    });
    if (!setting) {
      setting = await this.prisma.websiteSetting.findFirst({
        where: { key, domain: 'default' },
      });
    }
    return setting as WebsiteSetting | null;
  }

  @Query(() => [WebsiteSetting], { name: 'websiteSettingsByCategory' })
  async getWebsiteSettingsByCategory(
    @Args('category') category: string,
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<WebsiteSetting[]> {
    const where: any = {
      category: category as any,
      isActive: true,
      isPublic: true,
    };
    if (domain) {
      where.domain = domain;
    } else {
      where.OR = [
        { domain: this.getCurrentDomain() },
        { domain: 'default' },
      ];
    }
    return await this.prisma.websiteSetting.findMany({
      where,
      orderBy: { order: 'asc' },
    }) as WebsiteSetting[];
  }

  @Query(() => [WebsiteSetting], { name: 'headerSettings' })
  async getHeaderSettings(
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<WebsiteSetting[]> {
    const where: any = {
      category: 'HEADER' as any,
      isActive: true,
      isPublic: true,
    };
    if (domain) {
      where.domain = domain;
    } else {
      where.OR = [
        { domain: this.getCurrentDomain() },
        { domain: 'default' },
      ];
    }
    return await this.prisma.websiteSetting.findMany({
      where,
      orderBy: { order: 'asc' },
    }) as WebsiteSetting[];
  }

  @Query(() => [WebsiteSetting], { name: 'footerSettings' })
  async getFooterSettings(
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<WebsiteSetting[]> {
    const where: any = {
      category: 'FOOTER' as any,
      isActive: true,
      isPublic: true,
    };
    if (domain) {
      where.domain = domain;
    } else {
      where.OR = [
        { domain: this.getCurrentDomain() },
        { domain: 'default' },
      ];
    }
    return await this.prisma.websiteSetting.findMany({
      where,
      orderBy: { order: 'asc' },
    }) as WebsiteSetting[];
  }

  @Mutation(() => WebsiteSetting, { name: 'updateWebsiteSetting' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleType.ADMIN)
  async updateWebsiteSetting(
    @Args('key') key: string,
    @Args('input') input: UpdateWebsiteSettingInput,
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<WebsiteSetting> {
    const targetDomain = domain || this.getCurrentDomain();
    // Find the setting first
    const existing = await this.prisma.websiteSetting.findFirst({
      where: { key, domain: targetDomain },
    });
    if (!existing) {
      throw new Error(`Setting with key "${key}" and domain "${targetDomain}" not found`);
    }
    return await this.prisma.websiteSetting.update({
      where: { id: existing.id },
      data: {
        ...input,
        updatedAt: new Date(),
      },
    }) as WebsiteSetting;
  }

  @Mutation(() => WebsiteSetting, { name: 'createWebsiteSetting' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleType.ADMIN)
  async createWebsiteSetting(
    @Args('input') input: CreateWebsiteSettingInput,
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<WebsiteSetting> {
    const targetDomain = domain || this.getCurrentDomain();
    return await this.prisma.websiteSetting.create({
      data: {
        ...input,
        domain: targetDomain,
      },
    }) as WebsiteSetting;
  }

  @Mutation(() => WebsiteSetting, { name: 'deleteWebsiteSetting' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleType.ADMIN)
  async deleteWebsiteSetting(
    @Args('key') key: string,
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<WebsiteSetting> {
    const targetDomain = domain || this.getCurrentDomain();
    const existing = await this.prisma.websiteSetting.findFirst({
      where: { key, domain: targetDomain },
    });
    if (!existing) {
      throw new Error(`Setting with key "${key}" and domain "${targetDomain}" not found`);
    }
    return await this.prisma.websiteSetting.delete({
      where: { id: existing.id },
    }) as WebsiteSetting;
  }
}
