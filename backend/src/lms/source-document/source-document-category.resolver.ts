import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SourceDocumentCategoryService } from './source-document-category.service';
import { SourceDocumentCategory } from './entities/source-document.entity';
import {
  CreateSourceDocumentCategoryInput,
  UpdateSourceDocumentCategoryInput,
} from './dto/source-document.dto';

@Resolver(() => SourceDocumentCategory)
export class SourceDocumentCategoryResolver {
  constructor(
    private readonly categoryService: SourceDocumentCategoryService,
  ) {}

  @Mutation(() => SourceDocumentCategory)
  async createSourceDocumentCategory(
    @Args('input') input: CreateSourceDocumentCategoryInput,
  ) {
    return this.categoryService.create(input);
  }

  @Query(() => [SourceDocumentCategory])
  async sourceDocumentCategories() {
    return this.categoryService.findAll();
  }

  @Query(() => SourceDocumentCategory)
  async sourceDocumentCategory(@Args('id', { type: () => ID }) id: string) {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => SourceDocumentCategory)
  async updateSourceDocumentCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateSourceDocumentCategoryInput,
  ) {
    return this.categoryService.update(id, input);
  }

  @Mutation(() => SourceDocumentCategory)
  async deleteSourceDocumentCategory(@Args('id', { type: () => ID }) id: string) {
    return this.categoryService.delete(id);
  }

  @Query(() => [SourceDocumentCategory])
  async sourceDocumentCategoryTree() {
    return this.categoryService.getTree();
  }
}
