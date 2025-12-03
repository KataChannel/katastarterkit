import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ViewConfigService } from './view-config.service';
import {
  ProjectViewConfigType,
  SaveProjectViewConfigInput,
  GetProjectViewConfigsInput,
} from './dto/view-config.dto';

@Resolver(() => ProjectViewConfigType)
@UseGuards(JwtAuthGuard)
export class ViewConfigResolver {
  constructor(private readonly viewConfigService: ViewConfigService) {}

  // ==================== Queries ====================

  @Query(() => [ProjectViewConfigType], {
    name: 'projectViewConfigs',
    description: 'Lấy danh sách view configs của project',
  })
  async getProjectViewConfigs(@Args('input') input: GetProjectViewConfigsInput) {
    return this.viewConfigService.getProjectViewConfigs(input);
  }

  @Query(() => ProjectViewConfigType, {
    name: 'defaultProjectView',
    nullable: true,
    description: 'Lấy default view config của project',
  })
  async getDefaultView(
    @Args('projectId', { type: () => ID }) projectId: string,
    @Args('userId', { type: () => ID, nullable: true }) userId?: string,
  ) {
    return this.viewConfigService.getDefaultView(projectId, userId);
  }

  // ==================== Mutations ====================

  @Mutation(() => ProjectViewConfigType, {
    name: 'saveProjectViewConfig',
    description: 'Lưu hoặc cập nhật view config',
  })
  async saveProjectViewConfig(@Args('input') input: SaveProjectViewConfigInput) {
    return this.viewConfigService.saveProjectViewConfig(input);
  }

  @Mutation(() => Boolean, { name: 'deleteProjectViewConfig', description: 'Xóa view config' })
  async deleteProjectViewConfig(@Args('id', { type: () => ID }) id: string) {
    const result = await this.viewConfigService.deleteProjectViewConfig(id);
    return result.success;
  }
}
