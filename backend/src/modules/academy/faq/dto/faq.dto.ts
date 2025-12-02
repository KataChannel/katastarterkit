import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt, IsBoolean, Min } from 'class-validator';

@InputType()
export class CreateAcademyFAQInput {
  @Field()
  @IsString()
  question: string;

  @Field()
  @IsString()
  answer: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  category?: string;

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
export class UpdateAcademyFAQInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  question?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  answer?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  category?: string;

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
export class AcademyFAQFilterInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  category?: string;
}
