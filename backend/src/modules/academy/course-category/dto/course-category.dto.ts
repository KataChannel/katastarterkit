import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt, IsBoolean, Min } from 'class-validator';

@InputType()
export class CreateAcademyCourseCategoryInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  icon?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  image?: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;

  @Field({ nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

@InputType()
export class UpdateAcademyCourseCategoryInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  icon?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  image?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

@InputType()
export class AcademyCourseCategoryFilterInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
