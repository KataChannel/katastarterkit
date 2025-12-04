'use client';

import * as React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SourceDocumentSelector } from '@/components/lms/SourceDocumentSelector';

interface DocumentSelectionStepProps {
  documentIds: string[];
  onDocumentsChange: (ids: string[]) => void;
}

export function DocumentSelectionStep({
  documentIds,
  onDocumentsChange,
}: DocumentSelectionStepProps) {
  return (
    <div className="space-y-4">
      <Alert className="border-blue-200 bg-blue-50">
        <FileText className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 ml-2">
          <p className="font-medium mb-1">📌 Lưu ý quan trọng</p>
          <p className="text-sm">
            Chỉ các tài liệu đã được <strong>xuất bản (PUBLISHED)</strong> mới có thể được AI phân tích.
            AI sẽ tự động trích xuất nội dung và tạo khóa học hoàn chỉnh.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-5 h-5" />
            Chọn tài liệu nguồn
          </CardTitle>
          <CardDescription>
            Chọn tài liệu làm cơ sở để AI tạo khóa học
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SourceDocumentSelector
            value={documentIds}
            onChange={onDocumentsChange}
          />
          
          {documentIds.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Đã chọn {documentIds.length} tài liệu</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-4">
          <div className="text-sm space-y-2">
            <p className="font-medium text-amber-900">💡 Mẹo chọn tài liệu:</p>
            <ul className="text-amber-800 space-y-1 list-disc list-inside ml-2">
              <li>Chọn tài liệu có nội dung liên quan đến chủ đề khóa học</li>
              <li>Tài liệu rõ ràng, có cấu trúc sẽ cho kết quả tốt hơn</li>
              <li>Có thể chọn nhiều tài liệu để tạo khóa học phong phú</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
