import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoadmapService } from './roadmap.service';
import {
  RoadmapItemType,
  CreateRoadmapItemInput,
  UpdateRoadmapItemInput,
} from './dto/roadmap.dto';

@Resolver(() => RoadmapItemType)
@UseGuards(JwtAuthGuard)
export class RoadmapResolver {
  constructor(private readonly roadmapService: RoadmapService) {}

  // ==================== Queries ====================

  @Query(() => [RoadmapItemType], {
    name: 'roadmapItems',
    description: 'Lấy danh sách roadmap items của project',
  })
  async getRoadmapItems(@Args('projectId', { type: () => ID }) projectId: string) {
    return this.roadmapService.getRoadmapItems(projectId);
  }

  @Query(() => RoadmapItemType, { name: 'roadmapItem', description: 'Lấy chi tiết roadmap item' })
  async getRoadmapItem(@Args('id', { type: () => ID }) id: string) {
    return this.roadmapService.getRoadmapItem(id);
  }

  @Query(() => [RoadmapItemType], {
    name: 'roadmapByQuarter',
    description: 'Lấy roadmap items theo quarter',
  })
  async getRoadmapByQuarter(
    @Args('projectId', { type: () => ID }) projectId: string,
    @Args('quarter') quarter: string,
  ) {
    return this.roadmapService.getRoadmapByQuarter(projectId, quarter);
  }

  // ==================== Mutations ====================

  @Mutation(() => RoadmapItemType, { name: 'createRoadmapItem', description: 'Tạo roadmap item mới' })
  async createRoadmapItem(@Args('input') input: CreateRoadmapItemInput) {
    return this.roadmapService.createRoadmapItem(input);
  }

  @Mutation(() => RoadmapItemType, { name: 'updateRoadmapItem', description: 'Cập nhật roadmap item' })
  async updateRoadmapItem(@Args('input') input: UpdateRoadmapItemInput) {
    return this.roadmapService.updateRoadmapItem(input);
  }

  @Mutation(() => Boolean, { name: 'deleteRoadmapItem', description: 'Xóa roadmap item' })
  async deleteRoadmapItem(@Args('id', { type: () => ID }) id: string) {
    const result = await this.roadmapService.deleteRoadmapItem(id);
    return result.success;
  }
}
