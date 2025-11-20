import { ObjectType, Field, ID, registerEnumType, Int } from '@nestjs/graphql';

export enum GuideType {
  USER_GUIDE = 'USER_GUIDE',
  DEVELOPER_GUIDE = 'DEVELOPER_GUIDE',
  VIDEO_TUTORIAL = 'VIDEO_TUTORIAL',
  FAQ = 'FAQ',
}

registerEnumType(GuideType, { name: 'GuideType' });

@ObjectType()
export class SystemGuide {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  content: string;

  @Field(() => GuideType)
  type: GuideType;

  @Field({ nullable: true })
  category?: string;

  @Field(() => [String])
  tags: string[];

  @Field({ nullable: true })
  difficulty?: string;

  @Field({ nullable: true })
  thumbnailUrl?: string;

  @Field({ nullable: true })
  videoUrl?: string;

  @Field(() => [String])
  attachmentUrls: string[];

  @Field(() => Int)
  orderIndex: number;

  @Field({ nullable: true })
  parentId?: string;

  @Field(() => [String])
  relatedGuideIds: string[];

  @Field()
  slug: string;

  @Field({ nullable: true })
  metaTitle?: string;

  @Field({ nullable: true })
  metaDescription?: string;

  @Field(() => [String])
  keywords: string[];

  @Field()
  isPublished: boolean;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field(() => Int)
  viewCount: number;

  @Field(() => Int)
  helpfulCount: number;

  @Field(() => Int)
  notHelpfulCount: number;

  @Field(() => Int, { nullable: true })
  readingTime?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  authorId?: string;

  @Field({ nullable: true })
  updatedById?: string;
}

// Alias for consistency with other entities
export { SystemGuide as SystemGuideEntity };
