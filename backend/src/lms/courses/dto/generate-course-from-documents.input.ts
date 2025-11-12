import { InputType, Field, ID } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsString, ArrayMinSize } from 'class-validator';

@InputType()
export class GenerateCourseFromDocumentsInput {
  @Field(() => [ID], { description: 'Array of source document IDs to analyze' })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one document ID is required' })
  @IsNotEmpty({ message: 'documentIds cannot be empty' })
  documentIds: string[];

  @Field({ nullable: true, description: 'Optional category for the generated course' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @Field({ nullable: true, description: 'Optional additional instructions for AI' })
  @IsOptional()
  @IsString()
  additionalPrompt?: string;
}
