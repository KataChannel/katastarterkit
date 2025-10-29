import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  ProjectType,
  ProjectMemberType,
  CreateProjectInput,
  UpdateProjectInput,
  AddMemberInput,
  UpdateMemberRoleInput,
} from './dto/project.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => ProjectType)
@UseGuards(JwtAuthGuard)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  // ==================== PROJECT QUERIES ====================

  @Query(() => [ProjectType], {
    name: 'myProjects',
    description: 'Lấy tất cả projects mà user là thành viên (dùng cho Sidebar)',
  })
  async getMyProjects(
    @CurrentUser('id') userId: string,
    @Args('includeArchived', { type: () => Boolean, defaultValue: false })
    includeArchived: boolean,
  ): Promise<ProjectType[]> {
    return this.projectService.getMyProjects(userId, includeArchived) as any;
  }

  @Query(() => ProjectType, {
    name: 'project',
    description: 'Lấy chi tiết 1 project',
  })
  async getProject(
    @CurrentUser('id') userId: string,
    @Args('id') projectId: string,
  ): Promise<ProjectType> {
    return this.projectService.getProjectById(projectId, userId) as any;
  }

  @Query(() => [ProjectMemberType], {
    name: 'projectMembers',
    description: 'Lấy danh sách members (dùng cho @mention autocomplete)',
  })
  async getProjectMembers(
    @CurrentUser('id') userId: string,
    @Args('projectId') projectId: string,
  ): Promise<ProjectMemberType[]> {
    return this.projectService.getProjectMembers(projectId, userId) as any;
  }

  // ==================== PROJECT MUTATIONS ====================

  @Mutation(() => ProjectType, {
    name: 'createProject',
    description: 'Tạo dự án mới',
  })
  async createProject(
    @CurrentUser('id') userId: string,
    @Args('input') input: CreateProjectInput,
  ): Promise<ProjectType> {
    return this.projectService.createProject(userId, input) as any;
  }

  @Mutation(() => ProjectType, {
    name: 'updateProject',
    description: 'Update project (owner/admin only)',
  })
  async updateProject(
    @CurrentUser('id') userId: string,
    @Args('id') projectId: string,
    @Args('input') input: UpdateProjectInput,
  ): Promise<ProjectType> {
    return this.projectService.updateProject(projectId, userId, input) as any;
  }

  @Mutation(() => ProjectType, {
    name: 'deleteProject',
    description: 'Xóa project (soft delete = archive, owner only)',
  })
  async deleteProject(
    @CurrentUser('id') userId: string,
    @Args('id') projectId: string,
  ): Promise<ProjectType> {
    return this.projectService.deleteProject(projectId, userId) as any;
  }

  // ==================== MEMBER MUTATIONS ====================

  @Mutation(() => ProjectMemberType, {
    name: 'addProjectMember',
    description: 'Thêm thành viên vào project',
  })
  async addMember(
    @CurrentUser('id') userId: string,
    @Args('projectId') projectId: string,
    @Args('input') input: AddMemberInput,
  ): Promise<ProjectMemberType> {
    return this.projectService.addMember(projectId, userId, input) as any;
  }

  @Mutation(() => Boolean, {
    name: 'removeProjectMember',
    description: 'Xóa thành viên khỏi project',
  })
  async removeMember(
    @CurrentUser('id') userId: string,
    @Args('projectId') projectId: string,
    @Args('memberId') memberId: string,
  ): Promise<boolean> {
    await this.projectService.removeMember(projectId, userId, memberId);
    return true;
  }

  @Mutation(() => ProjectMemberType, {
    name: 'updateProjectMemberRole',
    description: 'Update role của member (owner only)',
  })
  async updateMemberRole(
    @CurrentUser('id') userId: string,
    @Args('projectId') projectId: string,
    @Args('input') input: UpdateMemberRoleInput,
  ): Promise<ProjectMemberType> {
    return this.projectService.updateMemberRole(
      projectId,
      userId,
      input.userId,
      input.role,
    ) as any;
  }
}
