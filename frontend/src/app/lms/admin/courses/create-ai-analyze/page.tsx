'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Sparkles, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CreateAIAnalyzePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentsParam = searchParams.get('documents');
  const documentIds = documentsParam ? documentsParam.split(',') : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                    Phân tích AI
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    AI sẽ phân tích tài liệu và đề xuất cấu trúc khóa học
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="space-y-6">
          {/* Documents Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Tài liệu đã chọn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Badge variant="outline">{documentIds.length} tài liệu</Badge>
                <span>sẽ được AI phân tích</span>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Notice */}
          <Alert className="border-purple-200 bg-purple-50">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <AlertDescription className="text-purple-900 mt-2">
              <p className="font-semibold mb-2">Tính năng đang được phát triển</p>
              <p className="text-sm">
                Tính năng "Phân tích AI" sẽ cho phép AI phân tích nội dung tài liệu nguồn và đề xuất:
              </p>
              <ul className="mt-2 space-y-1 text-sm list-disc list-inside ml-2">
                <li>Cấu trúc khóa học (modules, lessons)</li>
                <li>Các chủ đề chính và phụ</li>
                <li>Thời lượng ước tính cho từng phần</li>
                <li>Mức độ khó và trình tự học tập</li>
                <li>Đề xuất bài tập và câu hỏi đánh giá</li>
              </ul>
              <p className="text-sm mt-3">
                Bạn sẽ có thể xem đề xuất của AI và chỉnh sửa trước khi tạo khóa học.
              </p>
            </AlertDescription>
          </Alert>

          {/* Temporary Action */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">
                  Tính năng này sẽ có sẵn trong phiên bản tiếp theo
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/lms/admin/courses/create')}
                >
                  Quay lại chọn phương thức khác
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
