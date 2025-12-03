import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum } from 'class-validator';

@InputType()
export class CreateConversationWithAuthInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  customerName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  customerPhone?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  customerEmail?: string;

  @Field(() => String)
  @IsEnum(['GUEST', 'PHONE', 'ZALO', 'FACEBOOK', 'GOOGLE', 'USER_ACCOUNT'])
  authType: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  socialAccessToken?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  codeVerifier?: string; // For Zalo PKCE flow

  @Field(() => String, { nullable: true })
  @IsEnum(['WEBSITE', 'ZALO', 'FACEBOOK', 'TELEGRAM', 'WHATSAPP'])
  @IsOptional()
  platform?: string;
}
