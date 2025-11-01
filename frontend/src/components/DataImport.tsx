'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileSpreadsheet, 
  FileText, 
  FileJson, 
  Upload, 
  Eye, 
  Download,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface DataImportProps {
  modelName?: string;
  onImportComplete?: (result: any) => void;
}

interface PreviewData {
  headers: string[];
  rows: any[];
  totalRows: number;
}

interface FieldMapping {
  source: string;
  target: string;
}

export function DataImportComponent({ modelName = 'product', onImportComplete }: DataImportProps) {
  const [activeTab, setActiveTab] = useState<'excel' | 'text' | 'json'>('excel');
  const [rawData, setRawData] = useState<string>('');
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [selectedModel, setSelectedModel] = useState(modelName);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  // Paste handler
  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    setRawData(pastedData);
    parseData(pastedData, activeTab);
  };

  // Parse data based on type
  const parseData = (data: string, type: 'excel' | 'text' | 'json') => {
    try {
      let parsed: any[] = [];

      if (type === 'json') {
        const jsonData = JSON.parse(data);
        parsed = Array.isArray(jsonData) ? jsonData : [jsonData];
      } else if (type === 'text' || type === 'excel') {
        // Parse as TSV/CSV
        const lines = data.trim().split('\n');
        if (lines.length === 0) return;

        const headers = lines[0].split('\t');
        parsed = lines.slice(1).map(line => {
          const values = line.split('\t');
          const row: any = {};
          headers.forEach((header, i) => {
            row[header.trim()] = values[i]?.trim() || '';
          });
          return row;
        });

        // Auto-generate field mappings
        const mappings = headers.map(h => ({
          source: h.trim(),
          target: h.trim().toLowerCase().replace(/\s+/g, '_')
        }));
        setFieldMappings(mappings);
      }

      // Set preview
      if (parsed.length > 0) {
        setPreviewData({
          headers: Object.keys(parsed[0]),
          rows: parsed.slice(0, 10), // Preview first 10 rows
          totalRows: parsed.length
        });
        toast.success(`Đã parse ${parsed.length} dòng dữ liệu`);
      }
    } catch (error: any) {
      toast.error(`Lỗi parse dữ liệu: ${error.message}`);
    }
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      setRawData(data);
      
      if (file.name.endsWith('.json')) {
        setActiveTab('json');
        parseData(data, 'json');
      } else {
        setActiveTab('text');
        parseData(data, 'text');
      }
    };
    reader.readAsText(file);
  };

  // Update field mapping
  const updateMapping = (index: number, field: 'source' | 'target', value: string) => {
    const newMappings = [...fieldMappings];
    newMappings[index][field] = value;
    setFieldMappings(newMappings);
  };

  // Import data
  const handleImport = async () => {
    if (!previewData) {
      toast.error('Không có dữ liệu để import');
      return;
    }

    setIsImporting(true);
    
    try {
      // Parse lại toàn bộ data
      let allData: any[] = [];
      
      if (activeTab === 'json') {
        const jsonData = JSON.parse(rawData);
        allData = Array.isArray(jsonData) ? jsonData : [jsonData];
      } else {
        const lines = rawData.trim().split('\n');
        const headers = lines[0].split('\t');
        allData = lines.slice(1).map(line => {
          const values = line.split('\t');
          const row: any = {};
          headers.forEach((header, i) => {
            row[header.trim()] = values[i]?.trim() || '';
          });
          return row;
        });
      }

      // Apply field mappings
      const mappedData = allData.map(row => {
        const mapped: any = {};
        fieldMappings.forEach(({ source, target }) => {
          mapped[target] = row[source];
        });
        return mapped;
      });

      // TODO: Call GraphQL API
      const mockResult = {
        success: true,
        totalRows: mappedData.length,
        successRows: mappedData.length,
        errors: []
      };

      setImportResult(mockResult);
      toast.success(`Import thành công ${mockResult.successRows}/${mockResult.totalRows} dòng`);
      
      if (onImportComplete) {
        onImportComplete(mockResult);
      }
    } catch (error: any) {
      toast.error(`Lỗi import: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Dữ Liệu
          </CardTitle>
          <CardDescription>
            Copy/paste hoặc upload file Excel, Text, JSON để import vào database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Model Selection */}
          <div className="space-y-2">
            <Label>Model/Bảng dữ liệu</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs for different input types */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="excel" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Text/CSV
              </TabsTrigger>
              <TabsTrigger value="json" className="flex items-center gap-2">
                <FileJson className="h-4 w-4" />
                JSON
              </TabsTrigger>
            </TabsList>

            <TabsContent value="excel" className="space-y-4">
              <div className="space-y-2">
                <Label>Dán dữ liệu từ Excel (Ctrl+V)</Label>
                <Textarea
                  placeholder="Copy từ Excel và paste vào đây..."
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                  onPaste={handlePaste}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label>Upload hoặc dán dữ liệu Text/CSV</Label>
                <Input
                  type="file"
                  accept=".txt,.csv"
                  onChange={handleFileUpload}
                  className="mb-2"
                />
                <Textarea
                  placeholder="Hoặc paste dữ liệu text/CSV vào đây..."
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                  onPaste={handlePaste}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="json" className="space-y-4">
              <div className="space-y-2">
                <Label>Upload hoặc dán JSON data</Label>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="mb-2"
                />
                <Textarea
                  placeholder='{"name": "Product 1", "price": 100}'
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                  onPaste={handlePaste}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={() => parseData(rawData, activeTab)}
            className="w-full"
            disabled={!rawData}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview Dữ Liệu
          </Button>
        </CardContent>
      </Card>

      {/* Preview Data */}
      {previewData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview Dữ Liệu
              </span>
              <Badge variant="outline">
                {previewData.totalRows} dòng
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Field Mapping */}
            <div className="space-y-2">
              <Label>Mapping Trường Dữ Liệu</Label>
              <div className="grid gap-2">
                {fieldMappings.map((mapping, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={mapping.source}
                      onChange={(e) => updateMapping(index, 'source', e.target.value)}
                      placeholder="Source field"
                      className="flex-1"
                    />
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={mapping.target}
                      onChange={(e) => updateMapping(index, 'target', e.target.value)}
                      placeholder="Target field"
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Data Preview Table */}
            <div className="border rounded-lg overflow-auto max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    {previewData.headers.map((header, i) => (
                      <TableHead key={i}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.rows.map((row, i) => (
                    <TableRow key={i}>
                      {previewData.headers.map((header, j) => (
                        <TableCell key={j} className="font-mono text-xs">
                          {row[header]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Button 
              onClick={handleImport}
              className="w-full"
              disabled={isImporting}
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang import...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import vào {selectedModel}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Import Result */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {importResult.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Kết Quả Import
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Tổng số dòng:</span>
              <Badge>{importResult.totalRows}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Import thành công:</span>
              <Badge variant="default">{importResult.successRows}</Badge>
            </div>
            {importResult.errors.length > 0 && (
              <div className="flex justify-between">
                <span>Lỗi:</span>
                <Badge variant="destructive">{importResult.errors.length}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
