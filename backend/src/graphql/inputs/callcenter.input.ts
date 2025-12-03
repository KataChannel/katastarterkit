import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean, IsInt, IsEnum } from 'class-validator';
import { CallCenterSyncMode, CallDirection, CallStatus } from '../models/callcenter.model';

@InputType()
export class CreateCallCenterConfigInput {
  @Field(() => String)
  @IsString()
  apiUrl: string;

  @Field(() => String)
  @IsString()
  domain: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @Field(() => CallCenterSyncMode, { defaultValue: CallCenterSyncMode.MANUAL })
  @IsOptional()
  @IsEnum(CallCenterSyncMode)
  syncMode: CallCenterSyncMode;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  cronExpression?: string;

  @Field(() => Boolean, { defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @Field(() => Int, { defaultValue: 30 })
  @IsOptional()
  @IsInt()
  defaultDaysBack: number;

  @Field(() => Int, { defaultValue: 200 })
  @IsOptional()
  @IsInt()
  batchSize: number;
}

@InputType()
export class UpdateCallCenterConfigInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  apiUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  domain?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @Field(() => CallCenterSyncMode, { nullable: true })
  @IsOptional()
  @IsEnum(CallCenterSyncMode)
  syncMode?: CallCenterSyncMode;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  cronExpression?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  defaultDaysBack?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  batchSize?: number;
}

@InputType('SyncCallCenterInput')
export class SyncCallCenterInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  configId?: string;

  @Field(() => String, { nullable: true, description: 'ISO date string for fromDate' })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @Field(() => String, { nullable: true, description: 'ISO date string for toDate' })
  @IsOptional()
  @IsString()
  toDate?: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  fullSync?: boolean; // If true, sync all available data
}

@InputType()
export class CallCenterRecordFiltersInput {
  @Field(() => CallDirection, { nullable: true })
  @IsOptional()
  @IsEnum(CallDirection)
  direction?: CallDirection;

  @Field(() => CallStatus, { nullable: true })
  @IsOptional()
  @IsEnum(CallStatus)
  callStatus?: CallStatus;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  callerIdNumber?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  destinationNumber?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  domain?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  startDateFrom?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  startDateTo?: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string; // Search in caller, destination, etc.
}
