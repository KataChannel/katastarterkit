'use client';

/**
 * Field Mapping Component với Drag & Drop
 * Sử dụng @dnd-kit để drag-drop mapping giữa source và target fields
 */

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SchemaInspectorService, { FieldInfo } from '@/services/schemaInspector';
import { Loader2, AlertTriangle, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';

interface FieldMappingDragDropProps {
  sourceFields: string[]; // Fields từ dữ liệu import
  modelName: string; // Model đích trong database
  onMappingChange: (mapping: Record<string, string>) => void;
  initialMapping?: Record<string, string>;
}

export function FieldMappingDragDrop({
  sourceFields,
  modelName,
  onMappingChange,
  initialMapping = {},
}: FieldMappingDragDropProps) {
  const [targetFields, setTargetFields] = useState<FieldInfo[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>(initialMapping);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement để activate drag
      },
    })
  );

  // Load target fields và required fields
  useEffect(() => {
    loadTargetFields();
  }, [modelName]);

  // Auto-suggest mapping khi load lần đầu
  useEffect(() => {
    if (targetFields.length > 0 && Object.keys(mapping).length === 0) {
      autoSuggestMapping();
    }
  }, [targetFields]);

  // Validate mapping khi thay đổi
  useEffect(() => {
    if (Object.keys(mapping).length > 0) {
      validateMapping();
    }
  }, [mapping]);

  // Thông báo parent component khi mapping thay đổi
  useEffect(() => {
    onMappingChange(mapping);
  }, [mapping]);

  async function loadTargetFields() {
    try {
      setLoading(true);
      const [fields, required] = await Promise.all([
        SchemaInspectorService.getMappableFields(modelName),
        SchemaInspectorService.getRequiredFields(modelName),
      ]);

      setTargetFields(fields);
      setRequiredFields(required);
    } catch (error) {
      console.error('[FieldMapping] Error loading fields:', error);
    } finally {
      setLoading(false);
    }
  }

  async function autoSuggestMapping() {
    try {
      const suggestions = await SchemaInspectorService.suggestMapping(
        sourceFields,
        modelName
      );
      setMapping(suggestions);
    } catch (error) {
      console.error('[FieldMapping] Error auto-suggesting:', error);
    }
  }

  async function validateMapping() {
    try {
      const result = await SchemaInspectorService.validateMapping(modelName, mapping);
      setValidationErrors(result.errors);
    } catch (error) {
      console.error('[FieldMapping] Error validating:', error);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const sourceField = active.id as string;
    const targetField = over.id as string;

    // Kiểm tra nếu drop vào vùng unmap
    if (targetField === 'unmap-zone') {
      // Xóa mapping
      const newMapping = { ...mapping };
      delete newMapping[sourceField];
      setMapping(newMapping);
      return;
    }

    // Kiểm tra nếu target field hợp lệ
    const isValidTarget = targetFields.some(f => f.name === targetField);
    if (!isValidTarget) return;

    // Tạo mapping mới
    const newMapping = { ...mapping, [sourceField]: targetField };
    setMapping(newMapping);
  }

  function handleReset() {
    setMapping({});
    setValidationErrors([]);
  }

  function getTargetFieldForSource(sourceField: string): FieldInfo | undefined {
    const targetFieldName = mapping[sourceField];
    return targetFields.find(f => f.name === targetFieldName);
  }

  function isFieldRequired(fieldName: string): boolean {
    return requiredFields.includes(fieldName);
  }

  function isFieldMapped(targetFieldName: string): boolean {
    return Object.values(mapping).includes(targetFieldName);
  }

  function getMappingStats() {
    const totalSource = sourceFields.length;
    const totalMapped = Object.keys(mapping).length;
    const requiredMapped = requiredFields.filter(rf => 
      Object.values(mapping).includes(rf)
    ).length;
    const totalRequired = requiredFields.length;

    return {
      totalSource,
      totalMapped,
      requiredMapped,
      totalRequired,
      isComplete: requiredMapped === totalRequired && validationErrors.length === 0,
    };
  }

  const stats = getMappingStats();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Đang tải schema database...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {/* Header với stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mapping Fields</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalSource}</div>
                <div className="text-sm text-muted-foreground">Nguồn</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalMapped}</div>
                <div className="text-sm text-muted-foreground">Đã map</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.requiredMapped}/{stats.totalRequired}
                </div>
                <div className="text-sm text-muted-foreground">Bắt buộc</div>
              </div>
              <div className="text-center">
                {stats.isComplete ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600 mx-auto" />
                )}
                <div className="text-sm text-muted-foreground">
                  {stats.isComplete ? 'Hoàn tất' : 'Chưa xong'}
                </div>
              </div>
            </div>

            {/* Validation errors */}
            {validationErrors.length > 0 && (
              <Alert className="mt-4 border-red-500 bg-red-50 dark:bg-red-950">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Hướng dẫn */}
        <Alert>
          <AlertDescription>
            💡 <strong>Hướng dẫn:</strong> Kéo field từ bên trái (Dữ liệu nguồn) và thả vào
            field tương ứng bên phải (Database). Thả vào &quot;Unmap&quot; để xóa mapping.
          </AlertDescription>
        </Alert>

        {/* Mapping interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Source Fields - Bên trái */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dữ Liệu Nguồn ({sourceFields.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {sourceFields.map((field) => {
                    const targetField = getTargetFieldForSource(field);
                    return (
                      <div key={field} className="flex items-center gap-2">
                        <Draggable id={field}>
                          <div className="flex-1 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-200 dark:border-blue-800 cursor-move hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                            <div className="font-medium">{field}</div>
                          </div>
                        </Draggable>

                        {targetField && (
                          <>
                            <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <div className="flex-1 p-2 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800 text-sm">
                              <div className="font-medium">{targetField.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {SchemaInspectorService.formatFieldType(targetField)}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Target Fields - Bên phải */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Database - {modelName} ({targetFields.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {targetFields.map((field) => {
                    const isMapped = isFieldMapped(field.name);
                    const isRequired = isFieldRequired(field.name);

                    return (
                      <Droppable key={field.name} id={field.name}>
                        <div
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            isMapped
                              ? 'bg-green-50 dark:bg-green-950 border-green-500 dark:border-green-600'
                              : isRequired
                              ? 'bg-orange-50 dark:bg-orange-950 border-orange-300 dark:border-orange-700'
                              : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                          } ${!isMapped && 'hover:border-blue-400 dark:hover:border-blue-600'}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {SchemaInspectorService.formatFieldName(field)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {SchemaInspectorService.formatFieldType(field)}
                              </div>
                            </div>
                            <div className="flex-shrink-0 flex gap-1">
                              {isRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              )}
                              {isMapped && (
                                <Badge variant="default" className="text-xs bg-green-600">
                                  Mapped
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Droppable>
                    );
                  })}

                  {/* Unmap zone */}
                  <Droppable id="unmap-zone">
                    <div className="p-4 rounded-lg border-2 border-dashed border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950 text-center hover:border-red-500 dark:hover:border-red-500 transition-colors">
                      <XCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
                      <div className="text-sm font-medium text-red-600">
                        Thả vào đây để xóa mapping
                      </div>
                    </div>
                  </Droppable>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId ? (
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg border-2 border-blue-500 shadow-lg">
            <div className="font-medium">{activeId}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
