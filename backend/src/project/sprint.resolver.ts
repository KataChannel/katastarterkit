import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SprintService } from './sprint.service';
import {
  SprintType,
  CreateSprintInput,
  UpdateSprintInput,
  CloseSprintInput,
} from './dto/sprint.dto';

@Resolver(() => SprintType)
@UseGuards(JwtAuthGuard)
export class SprintResolver {
  constructor(private readonly sprintService: SprintService) {}

  // ==================== Queries ====================

  @Query(() => [SprintType], { name: 'sprints', description: 'Lấy danh sách sprints của project' })
  async getSprints(@Args('projectId', { type: () => ID }) projectId: string) {
    return this.sprintService.getSprints(projectId);
  }

  @Query(() => SprintType, { name: 'sprint', description: 'Lấy chi tiết sprint' })
  async getSprint(@Args('id', { type: () => ID }) id: string) {
    return this.sprintService.getSprint(id);
  }

  @Query(() => SprintType, {
    name: 'activeSprint',
    nullable: true,
    description: 'Lấy sprint đang active của project',
  })
  async getActiveSprint(@Args('projectId', { type: () => ID }) projectId: string) {
    return this.sprintService.getActiveSprint(projectId);
  }

  // ==================== Mutations ====================

  @Mutation(() => SprintType, { name: 'createSprint', description: 'Tạo sprint mới' })
  async createSprint(@Args('input') input: CreateSprintInput) {
    return this.sprintService.createSprint(input);
  }

  @Mutation(() => SprintType, { name: 'updateSprint', description: 'Cập nhật sprint' })
  async updateSprint(@Args('input') input: UpdateSprintInput) {
    return this.sprintService.updateSprint(input);
  }

  @Mutation(() => SprintType, { name: 'closeSprint', description: 'Đóng sprint và tính velocity' })
  async closeSprint(@Args('input') input: CloseSprintInput) {
    return this.sprintService.closeSprint(input);
  }

  @Mutation(() => Boolean, { name: 'deleteSprint', description: 'Xóa sprint' })
  async deleteSprint(@Args('id', { type: () => ID }) id: string) {
    const result = await this.sprintService.deleteSprint(id);
    return result.success;
  }
}
