import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class BranchModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  facebookUrl?: string;

  @Field({ nullable: true })
  facebookPageId?: string;

  @Field({ nullable: true })
  zaloUrl?: string;

  @Field({ nullable: true })
  zaloOaId?: string;

  @Field({ nullable: true })
  hotline?: string;

  @Field({ nullable: true })
  workingHours?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  shortDescription?: string;

  @Field({ nullable: true })
  featuredImage?: string;

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;

  @Field({ nullable: true })
  mapEmbedUrl?: string;

  @Field()
  isActive: boolean;

  @Field()
  isFeatured: boolean;

  @Field(() => Int)
  displayOrder: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
