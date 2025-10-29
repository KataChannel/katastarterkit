"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const project_service_1 = require("./project.service");
const project_dto_1 = require("./dto/project.dto");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ProjectResolver = class ProjectResolver {
    constructor(projectService) {
        this.projectService = projectService;
    }
    async getMyProjects(userId, includeArchived) {
        return this.projectService.getMyProjects(userId, includeArchived);
    }
    async getProject(userId, projectId) {
        return this.projectService.getProjectById(projectId, userId);
    }
    async getProjectMembers(userId, projectId) {
        return this.projectService.getProjectMembers(projectId, userId);
    }
    async createProject(userId, input) {
        return this.projectService.createProject(userId, input);
    }
    async updateProject(userId, projectId, input) {
        return this.projectService.updateProject(projectId, userId, input);
    }
    async deleteProject(userId, projectId) {
        return this.projectService.deleteProject(projectId, userId);
    }
    async addMember(userId, projectId, input) {
        return this.projectService.addMember(projectId, userId, input);
    }
    async removeMember(userId, projectId, memberId) {
        await this.projectService.removeMember(projectId, userId, memberId);
        return true;
    }
    async updateMemberRole(userId, projectId, input) {
        return this.projectService.updateMemberRole(projectId, userId, input.userId, input.role);
    }
};
exports.ProjectResolver = ProjectResolver;
__decorate([
    (0, graphql_1.Query)(() => [project_dto_1.ProjectType], {
        name: 'myProjects',
        description: 'Lấy tất cả projects mà user là thành viên (dùng cho Sidebar)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, graphql_1.Args)('includeArchived', { type: () => Boolean, defaultValue: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "getMyProjects", null);
__decorate([
    (0, graphql_1.Query)(() => project_dto_1.ProjectType, {
        name: 'project',
        description: 'Lấy chi tiết 1 project',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "getProject", null);
__decorate([
    (0, graphql_1.Query)(() => [project_dto_1.ProjectMemberType], {
        name: 'projectMembers',
        description: 'Lấy danh sách members (dùng cho @mention autocomplete)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, graphql_1.Args)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "getProjectMembers", null);
__decorate([
    (0, graphql_1.Mutation)(() => project_dto_1.ProjectType, {
        name: 'createProject',
        description: 'Tạo dự án mới',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, project_dto_1.CreateProjectInput]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "createProject", null);
__decorate([
    (0, graphql_1.Mutation)(() => project_dto_1.ProjectType, {
        name: 'updateProject',
        description: 'Update project (owner/admin only)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, graphql_1.Args)('id')),
    __param(2, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, project_dto_1.UpdateProjectInput]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "updateProject", null);
__decorate([
    (0, graphql_1.Mutation)(() => project_dto_1.ProjectType, {
        name: 'deleteProject',
        description: 'Xóa project (soft delete = archive, owner only)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "deleteProject", null);
__decorate([
    (0, graphql_1.Mutation)(() => project_dto_1.ProjectMemberType, {
        name: 'addProjectMember',
        description: 'Thêm thành viên vào project',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, graphql_1.Args)('projectId')),
    __param(2, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, project_dto_1.AddMemberInput]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "addMember", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean, {
        name: 'removeProjectMember',
        description: 'Xóa thành viên khỏi project',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, graphql_1.Args)('projectId')),
    __param(2, (0, graphql_1.Args)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "removeMember", null);
__decorate([
    (0, graphql_1.Mutation)(() => project_dto_1.ProjectMemberType, {
        name: 'updateProjectMemberRole',
        description: 'Update role của member (owner only)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, graphql_1.Args)('projectId')),
    __param(2, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, project_dto_1.UpdateMemberRoleInput]),
    __metadata("design:returntype", Promise)
], ProjectResolver.prototype, "updateMemberRole", null);
exports.ProjectResolver = ProjectResolver = __decorate([
    (0, graphql_1.Resolver)(() => project_dto_1.ProjectType),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectResolver);
//# sourceMappingURL=project.resolver.js.map