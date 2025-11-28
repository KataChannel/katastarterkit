'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Eye, Clock, BookOpen, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { APPROVE_COURSE, REJECT_COURSE } from '@/graphql/lms/courses.graphql';
import { APPROVE_DOCUMENT, REJECT_DOCUMENT } from '@/graphql/lms/source-documents';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';

// Query để lấy danh sách courses pending approval
const GET_PENDING_COURSES = gql`
  query GetPendingCourses {
    courses(filters: { status: DRAFT }) {
      data {
        id
        title
        slug
        description
        thumbnail
        approvalRequested
        approvalRequestedAt
        status
        createdAt
        instructor {
          id
          username
          firstName
          lastName
        }
      }
    }
  }
`;

// Query để lấy danh sách documents pending approval
const GET_PENDING_DOCUMENTS = gql`
  query GetPendingDocuments {
    sourceDocuments(filter: { approvalRequested: true }, limit: 100) {
      id
      title
      description
      content
      type
      status
      approvalRequested
      approvalRequestedAt
      createdAt
      url
      thumbnailUrl
      fileSize
      duration
      metadata
      user {
        id
        username
        firstName
        lastName
      }
      category {
        id
        name
      }
    }
  }
`;

export default function ApprovalManagementPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  // Queries
  const { data: coursesData, loading: coursesLoading, refetch: refetchCourses } = useQuery(GET_PENDING_COURSES);
  const { data: documentsData, loading: documentsLoading, refetch: refetchDocuments } = useQuery(GET_PENDING_DOCUMENTS);

  // Mutations
  const [approveCourse] = useMutation(APPROVE_COURSE);
  const [rejectCourse] = useMutation(REJECT_COURSE);
  const [approveDocument] = useMutation(APPROVE_DOCUMENT);
  const [rejectDocument] = useMutation(REJECT_DOCUMENT);

  const pendingCourses = coursesData?.courses?.data?.filter((c: any) => c.approvalRequested) || [];
  const pendingDocuments = documentsData?.sourceDocuments?.filter((d: any) => d.approvalRequested && d.status === 'DRAFT') || [];
  
  const handleApprove = async (type: 'course' | 'document', id: string, title: string) => {
    try {
      if (type === 'course') {
        await approveCourse({ variables: { courseId: id } });
        refetchCourses();
      } else {
        await approveDocument({ variables: { documentId: id } });
        refetchDocuments();
      }

      toast({
        title: 'Phê duyệt thành công',
        description: `Đã phê duyệt ${type === 'course' ? 'khóa học' : 'tài liệu'} "${title}"`,
        type: 'success',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể phê duyệt',
        type: 'error',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedItem || !rejectionReason.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập lý do từ chối',
        type: 'error',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (activeTab === 'courses') {
        await rejectCourse({
          variables: {
            courseId: selectedItem.id,
            reason: rejectionReason,
          },
        });
        refetchCourses();
      } else {
        await rejectDocument({
          variables: {
            documentId: selectedItem.id,
            reason: rejectionReason,
          },
        });
        refetchDocuments();
      }

      toast({
        title: 'Đã từ chối',
        description: `Đã từ chối ${activeTab === 'courses' ? 'khóa học' : 'tài liệu'} "${selectedItem.title}"`,
        type: 'success',
      });

      setRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedItem(null);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể từ chối',
        type: 'error',
        variant: 'destructive',
      });
    }
  };

  const openRejectDialog = (item: any) => {
    setSelectedItem(item);
    setRejectDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quản lý phê duyệt</h1>
        <p className="text-muted-foreground">
          Phê duyệt khóa học và tài liệu từ giảng viên
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="courses" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Khóa học ({pendingCourses.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="w-4 h-4" />
            Tài liệu ({pendingDocuments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          {coursesLoading ? (
            <div className="text-center py-12">Đang tải...</div>
          ) : pendingCourses.length === 0 ? (
            <Card className="p-8 sm:p-12 text-center">
              <p className="text-muted-foreground">Không có khóa học nào chờ phê duyệt</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingCourses.map((course: any) => (
                <Card key={course.id} className="p-4 sm:p-6">
                  {/* Header với thumbnail */}
                  <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                    {course.thumbnail && (
                      <div className="w-full sm:w-48 flex-shrink-0">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-32 sm:h-28 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold mb-2">{course.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="secondary">{course.status}</Badge>
                            <Badge variant="outline" className="gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(course.approvalRequestedAt), {
                                addSuffix: true,
                                locale: vi,
                              })}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Giảng viên:</span> {course.instructor.firstName} {course.instructor.lastName} (@{course.instructor.username})
                      </div>
                    </div>
                  </div>

                  {/* Nội dung đầy đủ */}
                  {course.description && (
                    <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="text-sm font-semibold mb-2 text-foreground">Mô tả khóa học:</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  )}

                  {/* Thông tin bổ sung */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">Slug:</span>
                      <code className="px-2 py-1 bg-muted rounded text-xs">{course.slug}</code>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">Ngày tạo:</span>
                      <span>{new Date(course.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                    <Link href={`/lms/admin/courses/${course.id}`} className="flex-1 sm:flex-none">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Eye className="w-4 h-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </Link>
                    <div className="flex gap-2 sm:ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openRejectDialog(course)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Từ chối
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 sm:flex-none"
                        onClick={() => handleApprove('course', course.id, course.title)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Phê duyệt
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents">
          {documentsLoading ? (
            <div className="text-center py-12">Đang tải...</div>
          ) : pendingDocuments.length === 0 ? (
            <Card className="p-8 sm:p-12 text-center">
              <p className="text-muted-foreground">Không có tài liệu nào chờ phê duyệt</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingDocuments.map((document: any) => {
                const isVideo = document.type === 'VIDEO';
                const isPDF = document.type === 'FILE' && document.url?.toLowerCase().endsWith('.pdf');
                const isImage = document.type === 'FILE' && /\.(jpg|jpeg|png|gif|webp)$/i.test(document.url || '');
                const isLink = document.type === 'LINK';
                const isText = document.type === 'TEXT';
                
                return (
                  <Card key={document.id} className="p-4 sm:p-6">
                    {/* Header với thumbnail */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                      {document.thumbnailUrl && (
                        <div className="w-full sm:w-48 flex-shrink-0">
                          <img
                            src={document.thumbnailUrl}
                            alt={document.title}
                            className="w-full h-32 sm:h-28 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-semibold mb-2">{document.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="secondary">{document.type}</Badge>
                              <Badge variant="outline">{document.status}</Badge>
                              <Badge variant="outline" className="gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(document.approvalRequestedAt), {
                                  addSuffix: true,
                                  locale: vi,
                                })}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Tác giả:</span> {document.user.firstName} {document.user.lastName} (@{document.user.username})
                        </div>
                      </div>
                    </div>

                    {/* Mô tả đầy đủ */}
                    {document.description && (
                      <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-semibold mb-2 text-foreground">Mô tả:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {document.description}
                        </p>
                      </div>
                    )}

                    {/* Preview nội dung theo type */}
                    {isVideo && document.url && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">Xem trước Video:</h4>
                        <video
                          controls
                          className="w-full rounded-lg max-h-[400px]"
                          src={document.url}
                        />
                        {document.duration && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Thời lượng: {Math.floor(document.duration / 60)}:{String(Math.floor(document.duration % 60)).padStart(2, '0')}
                          </p>
                        )}
                      </div>
                    )}

                    {isPDF && document.url && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">Xem trước PDF:</h4>
                        <div className="border rounded-lg overflow-hidden">
                          <iframe
                            src={`${document.url}#toolbar=0`}
                            className="w-full h-[400px]"
                            title={document.title}
                          />
                        </div>
                      </div>
                    )}

                    {isImage && document.url && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">Xem trước ảnh:</h4>
                        <img
                          src={document.url}
                          alt={document.title}
                          className="w-full rounded-lg max-h-[400px] object-contain bg-muted"
                        />
                      </div>
                    )}

                    {isLink && document.url && (
                      <div className="mb-4 p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                        <h4 className="text-sm font-semibold mb-2">Liên kết:</h4>
                        <a
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                        >
                          {document.url}
                        </a>
                      </div>
                    )}

                    {isText && document.content && (
                      <div className="mb-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg">
                        <h4 className="text-sm font-semibold mb-2">Nội dung văn bản:</h4>
                        <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                          {document.content}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs sm:text-sm">
                      {document.category && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="font-medium">Danh mục:</span>
                          <span>{document.category.name}</span>
                        </div>
                      )}
                      {document.fileSize && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="font-medium">Kích thước:</span>
                          <span>{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      )}
                      {document.metadata?.width && document.metadata?.height && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="font-medium">Kích thước:</span>
                          <span>{document.metadata.width} × {document.metadata.height}px</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-medium">Ngày tạo:</span>
                        <span>{new Date(document.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                      <Link href={`/lms/admin/source-documents/${document.id}`} className="flex-1 sm:flex-none">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      </Link>
                      <div className="flex gap-2 sm:ml-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openRejectDialog(document)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Từ chối
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 sm:flex-none"
                          onClick={() => handleApprove('document', document.id, document.title)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Phê duyệt
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối {activeTab === 'courses' ? 'khóa học' : 'tài liệu'}</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối "{selectedItem?.title}"
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Nhập lý do từ chối..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleReject} variant="destructive">
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
