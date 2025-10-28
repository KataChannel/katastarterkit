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
exports.CoursesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const courses_service_1 = require("./courses.service");
const course_entity_1 = require("./entities/course.entity");
const create_course_input_1 = require("./dto/create-course.input");
const update_course_input_1 = require("./dto/update-course.input");
const course_filters_input_1 = require("./dto/course-filters.input");
const module_input_1 = require("./dto/module.input");
const lesson_input_1 = require("./dto/lesson.input");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const client_1 = require("@prisma/client");
const course_module_entity_1 = require("./entities/course-module.entity");
const lesson_entity_1 = require("./entities/lesson.entity");
let CoursesResolver = class CoursesResolver {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    createCourse(user, createCourseInput) {
        return this.coursesService.create(user.userId, createCourseInput);
    }
    findAll(filters) {
        return this.coursesService.findAll(filters || new course_filters_input_1.CourseFiltersInput());
    }
    findOne(id) {
        return this.coursesService.findOne(id);
    }
    findBySlug(slug) {
        return this.coursesService.findBySlug(slug);
    }
    getMyCourses(user) {
        return this.coursesService.getMyCourses(user.userId);
    }
    updateCourse(user, updateCourseInput) {
        return this.coursesService.update(updateCourseInput.id, user.userId, updateCourseInput);
    }
    publishCourse(user, id) {
        return this.coursesService.publish(id, user.userId);
    }
    archiveCourse(user, id) {
        return this.coursesService.archive(id, user.userId);
    }
    async removeCourse(user, id) {
        const result = await this.coursesService.remove(id, user.userId);
        return result.success;
    }
    createModule(user, input) {
        return this.coursesService.createModule(user.userId, input);
    }
    updateModule(user, input) {
        return this.coursesService.updateModule(user.userId, input);
    }
    async deleteModule(user, id) {
        const result = await this.coursesService.deleteModule(user.userId, id);
        return result.success;
    }
    reorderModules(user, input) {
        return this.coursesService.reorderModules(user.userId, input);
    }
    createLesson(user, input) {
        return this.coursesService.createLesson(user.userId, input);
    }
    updateLesson(user, input) {
        return this.coursesService.updateLesson(user.userId, input);
    }
    async deleteLesson(user, id) {
        const result = await this.coursesService.deleteLesson(user.userId, id);
        return result.success;
    }
    reorderLessons(user, input) {
        return this.coursesService.reorderLessons(user.userId, input);
    }
};
exports.CoursesResolver = CoursesResolver;
__decorate([
    (0, graphql_1.Mutation)(() => course_entity_1.Course, { name: 'createCourse' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('createCourseInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_course_input_1.CreateCourseInput]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "createCourse", null);
__decorate([
    (0, graphql_1.Query)(() => [course_entity_1.Course], { name: 'courses' }),
    __param(0, (0, graphql_1.Args)('filters', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_filters_input_1.CourseFiltersInput]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => course_entity_1.Course, { name: 'course' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => course_entity_1.Course, { name: 'courseBySlug' }),
    __param(0, (0, graphql_1.Args)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "findBySlug", null);
__decorate([
    (0, graphql_1.Query)(() => [course_entity_1.Course], { name: 'myCourses' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "getMyCourses", null);
__decorate([
    (0, graphql_1.Mutation)(() => course_entity_1.Course, { name: 'updateCourse' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('updateCourseInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_course_input_1.UpdateCourseInput]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "updateCourse", null);
__decorate([
    (0, graphql_1.Mutation)(() => course_entity_1.Course, { name: 'publishCourse' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "publishCourse", null);
__decorate([
    (0, graphql_1.Mutation)(() => course_entity_1.Course, { name: 'archiveCourse' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "archiveCourse", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean, { name: 'deleteCourse' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CoursesResolver.prototype, "removeCourse", null);
__decorate([
    (0, graphql_1.Mutation)(() => course_module_entity_1.CourseModule, { name: 'createModule' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, module_input_1.CreateModuleInput]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "createModule", null);
__decorate([
    (0, graphql_1.Mutation)(() => course_module_entity_1.CourseModule, { name: 'updateModule' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, module_input_1.UpdateModuleInput]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "updateModule", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean, { name: 'deleteModule' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CoursesResolver.prototype, "deleteModule", null);
__decorate([
    (0, graphql_1.Mutation)(() => [course_module_entity_1.CourseModule], { name: 'reorderModules' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, module_input_1.ReorderModulesInput]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "reorderModules", null);
__decorate([
    (0, graphql_1.Mutation)(() => lesson_entity_1.Lesson, { name: 'createLesson' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, lesson_input_1.CreateLessonInput]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "createLesson", null);
__decorate([
    (0, graphql_1.Mutation)(() => lesson_entity_1.Lesson, { name: 'updateLesson' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, lesson_input_1.UpdateLessonInput]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "updateLesson", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean, { name: 'deleteLesson' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CoursesResolver.prototype, "deleteLesson", null);
__decorate([
    (0, graphql_1.Mutation)(() => [lesson_entity_1.Lesson], { name: 'reorderLessons' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, lesson_input_1.ReorderLessonsInput]),
    __metadata("design:returntype", void 0)
], CoursesResolver.prototype, "reorderLessons", null);
exports.CoursesResolver = CoursesResolver = __decorate([
    (0, graphql_1.Resolver)(() => course_entity_1.Course),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesResolver);
//# sourceMappingURL=courses.resolver.js.map