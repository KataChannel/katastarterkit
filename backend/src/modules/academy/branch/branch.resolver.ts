import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, SetMetadata } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchModel } from './models/branch.model';
import { CreateBranchInput, UpdateBranchInput, BranchFilterInput } from './dto/branch.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../auth/roles.decorator';

// Public decorator
const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Resolver(() => BranchModel)
export class BranchResolver {
  constructor(private readonly branchService: BranchService) {}

  // ============ PUBLIC QUERIES ============

  @Public()
  @Query(() => [BranchModel], { name: 'branches', description: 'Lấy danh sách chi nhánh' })
  async getBranches(
    @Args('filter', { nullable: true }) filter?: BranchFilterInput,
  ) {
    return this.branchService.findAll(filter);
  }

  @Public()
  @Query(() => BranchModel, { name: 'branch', description: 'Lấy chi tiết chi nhánh theo ID' })
  async getBranch(@Args('id', { type: () => ID }) id: string) {
    return this.branchService.findOne(id);
  }

  @Public()
  @Query(() => BranchModel, { name: 'branchBySlug', description: 'Lấy chi tiết chi nhánh theo slug' })
  async getBranchBySlug(@Args('slug') slug: string) {
    return this.branchService.findBySlug(slug);
  }

  // ============ ADMIN MUTATIONS ============

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => BranchModel, { description: 'Tạo chi nhánh mới' })
  async createBranch(@Args('input') input: CreateBranchInput) {
    return this.branchService.create(input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => BranchModel, { description: 'Cập nhật chi nhánh' })
  async updateBranch(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateBranchInput,
  ) {
    return this.branchService.update(id, input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => Boolean, { description: 'Xóa chi nhánh' })
  async deleteBranch(@Args('id', { type: () => ID }) id: string) {
    return this.branchService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => BranchModel, { description: 'Bật/tắt trạng thái hoạt động' })
  async toggleBranchActive(@Args('id', { type: () => ID }) id: string) {
    return this.branchService.toggleActive(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => BranchModel, { description: 'Bật/tắt trạng thái nổi bật' })
  async toggleBranchFeatured(@Args('id', { type: () => ID }) id: string) {
    return this.branchService.toggleFeatured(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Mutation(() => BranchModel, { description: 'Cập nhật thứ tự hiển thị' })
  async updateBranchDisplayOrder(
    @Args('id', { type: () => ID }) id: string,
    @Args('displayOrder') displayOrder: number,
  ) {
    return this.branchService.updateDisplayOrder(id, displayOrder);
  }
}
