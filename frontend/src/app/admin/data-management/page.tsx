'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataImportComponent } from '@/components/DataImport';
import { ImageUploadComponent } from '@/components/ImageUpload';
import { FileSpreadsheet, Image, Database } from 'lucide-react';

export default function DataManagementPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Dữ Liệu</h1>
        <p className="text-muted-foreground">
          Import/Export dữ liệu và quản lý hình ảnh với Dynamic GraphQL
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="import" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="import" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Data Import/Export
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Image Upload
          </TabsTrigger>
        </TabsList>

        {/* Data Import/Export Tab */}
        <TabsContent value="import" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Import & Export Dữ Liệu
              </CardTitle>
              <CardDescription>
                Copy dữ liệu từ Excel, Text, JSON → Edit → Mapping → Lưu vào Database
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <DataImportComponent
                modelName="product"
                onImportComplete={(result) => {
                  console.log('Import completed:', result);
                }}
              />
            </CardContent>
          </Card>

          {/* Features Info */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📋 Copy & Paste</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Copy dữ liệu từ Excel hoặc paste text/JSON trực tiếp vào ô nhập liệu
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🔄 Auto Mapping</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Tự động mapping trường dữ liệu hoặc tùy chỉnh mapping theo ý muốn
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💾 Dynamic Save</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Sử dụng Dynamic GraphQL để lưu vào bất kỳ model nào trong database
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Image Upload Tab */}
        <TabsContent value="image" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Upload & Edit Hình Ảnh
              </CardTitle>
              <CardDescription>
                Copy hình ảnh → Edit → Upload MinIO → Mapping → Lưu vào Database
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ImageUploadComponent
                modelName="product"
                recordId="1"
                imageField="imageUrl"
                onUploadComplete={(result) => {
                  console.log('Upload completed:', result);
                }}
              />
            </CardContent>
          </Card>

          {/* Image Features Info */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📸 Multi Source</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Upload từ file, paste clipboard, hoặc copy từ URL
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">✂️ Edit Tools</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Resize, rotate, flip, crop, blur và nhiều công cụ khác
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">☁️ MinIO Storage</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Upload lên MinIO object storage an toàn và hiệu quả
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🔗 Auto Mapping</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Tự động map URL hình ảnh vào record trong database
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Documentation Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>📚 Hướng Dẫn Sử Dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Import Dữ Liệu:</h3>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Chọn Model/Bảng dữ liệu cần import</li>
              <li>Copy dữ liệu từ Excel/Text/JSON và paste vào ô nhập liệu</li>
              <li>Click "Preview Dữ Liệu" để xem trước</li>
              <li>Kiểm tra và điều chỉnh Field Mapping nếu cần</li>
              <li>Click "Import" để lưu vào database</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Upload Hình Ảnh:</h3>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Click để chọn file hoặc paste hình ảnh (Ctrl+V)</li>
              <li>Hoặc nhập URL để copy hình ảnh từ internet</li>
              <li>Sử dụng các công cụ edit để chỉnh sửa hình ảnh</li>
              <li>Click "Apply Edits" để áp dụng thay đổi</li>
              <li>Click "Upload lên MinIO" để hoàn tất</li>
            </ol>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              💡 Tip: Tất cả các tính năng đều sử dụng Dynamic GraphQL Engine để tự động
              tạo queries/mutations cho bất kỳ model nào trong database.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
