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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlogTagInput = exports.CreateBlogTagInput = exports.UpdateBlogCategoryInput = exports.CreateBlogCategoryInput = exports.GetBlogsInput = exports.UpdateBlogInput = exports.CreateBlogInput = void 0;
const graphql_1 = require("@nestjs/graphql");
let CreateBlogInput = class CreateBlogInput {
};
exports.CreateBlogInput = CreateBlogInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateBlogInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateBlogInput.prototype, "slug", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateBlogInput.prototype, "content", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateBlogInput.prototype, "shortDescription", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateBlogInput.prototype, "excerpt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateBlogInput.prototype, "author", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateBlogInput.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateBlogInput.prototype, "bannerUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateBlogInput.prototype, "categoryId", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateBlogInput.prototype, "tagIds", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, defaultValue: false }),
    __metadata("design:type", Boolean)
], CreateBlogInput.prototype, "isFeatured", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, defaultValue: true }),
    __metadata("design:type", Boolean)
], CreateBlogInput.prototype, "isPublished", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], CreateBlogInput.prototype, "publishedAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateBlogInput.prototype, "metaTitle", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateBlogInput.prototype, "metaDescription", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateBlogInput.prototype, "metaKeywords", void 0);
exports.CreateBlogInput = CreateBlogInput = __decorate([
    (0, graphql_1.InputType)()
], CreateBlogInput);
let UpdateBlogInput = class UpdateBlogInput {
};
exports.UpdateBlogInput = UpdateBlogInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UpdateBlogInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogInput.prototype, "slug", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogInput.prototype, "content", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogInput.prototype, "shortDescription", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogInput.prototype, "excerpt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogInput.prototype, "author", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogInput.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogInput.prototype, "bannerUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogInput.prototype, "categoryId", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], UpdateBlogInput.prototype, "tagIds", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], UpdateBlogInput.prototype, "isFeatured", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], UpdateBlogInput.prototype, "isPublished", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], UpdateBlogInput.prototype, "publishedAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogInput.prototype, "metaTitle", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogInput.prototype, "metaDescription", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogInput.prototype, "metaKeywords", void 0);
exports.UpdateBlogInput = UpdateBlogInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateBlogInput);
let GetBlogsInput = class GetBlogsInput {
};
exports.GetBlogsInput = GetBlogsInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, defaultValue: 1 }),
    __metadata("design:type", Number)
], GetBlogsInput.prototype, "page", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, defaultValue: 12 }),
    __metadata("design:type", Number)
], GetBlogsInput.prototype, "limit", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], GetBlogsInput.prototype, "search", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], GetBlogsInput.prototype, "categoryId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true, defaultValue: 'latest' }),
    __metadata("design:type", String)
], GetBlogsInput.prototype, "sort", void 0);
exports.GetBlogsInput = GetBlogsInput = __decorate([
    (0, graphql_1.InputType)()
], GetBlogsInput);
let CreateBlogCategoryInput = class CreateBlogCategoryInput {
};
exports.CreateBlogCategoryInput = CreateBlogCategoryInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateBlogCategoryInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateBlogCategoryInput.prototype, "slug", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateBlogCategoryInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateBlogCategoryInput.prototype, "thumbnail", void 0);
exports.CreateBlogCategoryInput = CreateBlogCategoryInput = __decorate([
    (0, graphql_1.InputType)()
], CreateBlogCategoryInput);
let UpdateBlogCategoryInput = class UpdateBlogCategoryInput {
};
exports.UpdateBlogCategoryInput = UpdateBlogCategoryInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UpdateBlogCategoryInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogCategoryInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogCategoryInput.prototype, "slug", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogCategoryInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogCategoryInput.prototype, "thumbnail", void 0);
exports.UpdateBlogCategoryInput = UpdateBlogCategoryInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateBlogCategoryInput);
let CreateBlogTagInput = class CreateBlogTagInput {
};
exports.CreateBlogTagInput = CreateBlogTagInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateBlogTagInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateBlogTagInput.prototype, "slug", void 0);
exports.CreateBlogTagInput = CreateBlogTagInput = __decorate([
    (0, graphql_1.InputType)()
], CreateBlogTagInput);
let UpdateBlogTagInput = class UpdateBlogTagInput {
};
exports.UpdateBlogTagInput = UpdateBlogTagInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UpdateBlogTagInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogTagInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateBlogTagInput.prototype, "slug", void 0);
exports.UpdateBlogTagInput = UpdateBlogTagInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateBlogTagInput);
//# sourceMappingURL=blog.input.js.map