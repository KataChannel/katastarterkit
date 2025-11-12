import { Resolver, Query, Mutation, Args, ID, Int, Context } from '@nestjs/graphql';
// import { UseGuards } from '@nestjs/common';
import { SourceDocumentService } from './source-document.service';
import { MinioService } from '../../minio/minio.service';
import {
  SourceDocument,
  CourseSourceDocument,
} from './entities/source-document.entity';
import {
  CreateSourceDocumentInput,
  UpdateSourceDocumentInput,
  SourceDocumentFilterInput,
  LinkDocumentToCourseInput,
  UpdateCourseDocumentLinkInput,
} from './dto/source-document.dto';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
// import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';

@Resolver(() => SourceDocument)
export class SourceDocumentResolver {
  constructor(
    private readonly sourceDocumentService: SourceDocumentService,
    private readonly minioService: MinioService,
  ) {}

  @Mutation(() => SourceDocument)
  // @UseGuards(GqlAuthGuard) // TODO: Add auth guard
  async createSourceDocument(
    @Args('input') input: CreateSourceDocumentInput,
    @Args('userId', { type: () => ID }) userId: string, // Temporary: pass userId as argument
  ) {
    return this.sourceDocumentService.create(userId, input);
  }

  @Query(() => [SourceDocument])
  async sourceDocuments(
    @Args('filter', { nullable: true }) filter?: SourceDocumentFilterInput,
    @Args('page', { type: () => Int, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit?: number,
  ) {
    const result = await this.sourceDocumentService.findAll(filter, page, limit);
    return result.items;
  }

  @Query(() => SourceDocument)
  async sourceDocument(@Args('id', { type: () => ID }) id: string) {
    return this.sourceDocumentService.findOne(id);
  }

  @Mutation(() => SourceDocument)
  // @UseGuards(GqlAuthGuard) // TODO: Add auth guard
  async updateSourceDocument(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateSourceDocumentInput,
  ) {
    return this.sourceDocumentService.update(id, input);
  }

  @Mutation(() => SourceDocument)
  // @UseGuards(GqlAuthGuard) // TODO: Add auth guard
  async deleteSourceDocument(@Args('id', { type: () => ID }) id: string) {
    return this.sourceDocumentService.delete(id);
  }

  // ============== Course Linking ==============

  @Mutation(() => CourseSourceDocument)
  // @UseGuards(GqlAuthGuard) // TODO: Add auth guard
  async linkDocumentToCourse(
    @Args('input') input: LinkDocumentToCourseInput,
    @Args('userId', { type: () => ID }) userId: string, // Temporary
  ) {
    return this.sourceDocumentService.linkToCourse(userId, input);
  }

  @Mutation(() => Boolean)
  // @UseGuards(GqlAuthGuard) // TODO: Add auth guard
  async unlinkDocumentFromCourse(
    @Args('courseId', { type: () => ID }) courseId: string,
    @Args('documentId', { type: () => ID }) documentId: string,
  ) {
    const result = await this.sourceDocumentService.unlinkFromCourse(
      courseId,
      documentId,
    );
    return result.success;
  }

  @Mutation(() => CourseSourceDocument)
  // @UseGuards(GqlAuthGuard) // TODO: Add auth guard
  async updateCourseDocumentLink(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateCourseDocumentLinkInput,
  ) {
    return this.sourceDocumentService.updateCourseLink(id, input);
  }

  @Query(() => [CourseSourceDocument])
  async courseDocuments(@Args('courseId', { type: () => ID }) courseId: string) {
    return this.sourceDocumentService.getCourseDocuments(courseId);
  }

  // ============== Stats ==============

  @Mutation(() => SourceDocument)
  async incrementDocumentDownload(@Args('id', { type: () => ID }) id: string) {
    return this.sourceDocumentService.incrementDownloadCount(id);
  }

  @Query(() => String)
  // @UseGuards(GqlAuthGuard) // TODO: Add auth guard
  async sourceDocumentStats(
    @Args('userId', { type: () => ID, nullable: true }) userId?: string,
  ) {
    const stats = await this.sourceDocumentService.getStats(userId);
    return JSON.stringify(stats);
  }

  // ============== File Upload ==============

  @Mutation(() => String)
  // @UseGuards(GqlAuthGuard) // TODO: Add auth guard
  async uploadSourceDocumentFile(
    @Args('documentId', { type: () => ID }) documentId: string,
    @Args({ name: 'file', type: () => GraphQLUpload }) file: Promise<FileUpload>,
  ): Promise<string> {
    const { createReadStream, filename, mimetype } = await file;
    
    // Convert stream to buffer
    const chunks: Buffer[] = [];
    const stream = createReadStream();
    
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const url = await this.minioService.uploadSourceDocument(
            documentId,
            buffer,
            filename,
            mimetype,
          );
          
          // Update document with file info
          await this.sourceDocumentService.update(documentId, {
            url,
            fileName: filename,
            fileSize: buffer.length,
            mimeType: mimetype,
          });
          
          resolve(url);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  @Mutation(() => String)
  // @UseGuards(GqlAuthGuard) // TODO: Add auth guard
  async uploadDocumentThumbnail(
    @Args('documentId', { type: () => ID }) documentId: string,
    @Args({ name: 'file', type: () => GraphQLUpload }) file: Promise<FileUpload>,
  ): Promise<string> {
    const { createReadStream, mimetype } = await file;
    
    const chunks: Buffer[] = [];
    const stream = createReadStream();
    
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const url = await this.minioService.uploadDocumentThumbnail(
            documentId,
            buffer,
            mimetype,
          );
          
          // Update document with thumbnail
          await this.sourceDocumentService.update(documentId, {
            thumbnailUrl: url,
          });
          
          resolve(url);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // ============== AI Analysis ==============

  @Mutation(() => SourceDocument)
  // @UseGuards(GqlAuthGuard) // TODO: Add auth guard
  async analyzeSourceDocument(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<any> {
    return this.sourceDocumentService.analyzeDocument(id);
  }

  @Mutation(() => String)
  // @UseGuards(GqlAuthGuard) // TODO: Add auth guard
  async bulkAnalyzeDocuments(
    @Args('userId', { type: () => ID, nullable: true }) userId?: string,
  ): Promise<string> {
    const result = await this.sourceDocumentService.bulkAnalyze(userId);
    return JSON.stringify(result);
  }
}
