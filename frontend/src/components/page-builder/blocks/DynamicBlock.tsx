import React, { useState, useEffect } from 'react';
import { PageBlock, DynamicBlockConfig } from '@/types/page-builder';
import { Settings, Trash2, RefreshCw, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

interface DynamicBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
}

export const DynamicBlock: React.FC<DynamicBlockProps> = ({
  block,
  isEditable = true,
  onUpdate,
  onDelete,
}) => {
  const config = block.config as DynamicBlockConfig;
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState<DynamicBlockConfig>(config || {});
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data based on configuration
  useEffect(() => {
    if (!config?.dataSource) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (config.dataSource.type === 'static') {
          setData(config.dataSource.staticData);
        } else if (config.dataSource.type === 'api') {
          const response = await fetch(config.dataSource.endpoint || '', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config.dataSource.variables || {}),
          });
          const result = await response.json();
          setData(result);
        } else if (config.dataSource.type === 'graphql') {
          const response = await fetch(config.dataSource.endpoint || '/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: config.dataSource.query,
              variables: config.dataSource.variables,
            }),
          });
          const result = await response.json();
          setData(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [config]);

  // Evaluate conditions
  const evaluateConditions = (item: any): boolean => {
    if (!config?.conditions || config.conditions.length === 0) return true;

    return config.conditions.every((condition, index) => {
      const fieldValue = item[condition.field];
      let result = false;

      switch (condition.operator) {
        case 'equals':
          result = fieldValue === condition.value;
          break;
        case 'notEquals':
          result = fieldValue !== condition.value;
          break;
        case 'contains':
          result = String(fieldValue).includes(String(condition.value));
          break;
        case 'greaterThan':
          result = Number(fieldValue) > Number(condition.value);
          break;
        case 'lessThan':
          result = Number(fieldValue) < Number(condition.value);
          break;
        case 'exists':
          result = fieldValue !== null && fieldValue !== undefined;
          break;
      }

      // Handle logic operators (AND/OR)
      if (index > 0 && config.conditions[index - 1]?.logic === 'OR') {
        return result; // OR logic - any true condition passes
      }
      return result; // Default AND logic
    });
  };

  // Replace template variables
  const replaceVariables = (template: string, item: any): string => {
    let result = template;
    
    // Replace {{variable}} syntax
    const matches = template.match(/\{\{([^}]+)\}\}/g);
    if (matches) {
      matches.forEach((match) => {
        const key = match.replace(/\{\{|\}\}/g, '').trim();
        const value = item[key] || config?.variables?.[key] || '';
        result = result.replace(match, String(value));
      });
    }

    return result;
  };

  // Render dynamic content
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2">Loading...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
          <strong>Error:</strong> {error}
        </div>
      );
    }

    if (!data) {
      return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded text-gray-500">
          No data available. Configure data source in settings.
        </div>
      );
    }

    // Handle repeater pattern
    if (config?.repeater?.enabled) {
      const dataPath = config.repeater.dataPath || '';
      const items = dataPath ? eval(`data.${dataPath}`) : data;
      
      if (!Array.isArray(items)) {
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
            Data path does not return an array
          </div>
        );
      }

      const filteredItems = items.filter(evaluateConditions);
      const limitedItems = config.repeater.limit 
        ? filteredItems.slice(0, config.repeater.limit)
        : filteredItems;

      return (
        <div className="grid gap-4">
          {limitedItems.map((item, index) => (
            <Card key={index} className="p-4">
              {config.repeater.itemTemplate ? (
                <div>
                  <h3 className="font-bold">
                    {replaceVariables(config.repeater.itemTemplate.content?.title || '', item)}
                  </h3>
                  <p className="text-gray-600">
                    {replaceVariables(config.repeater.itemTemplate.content?.description || '', item)}
                  </p>
                </div>
              ) : (
                <pre className="text-sm">{JSON.stringify(item, null, 2)}</pre>
              )}
            </Card>
          ))}
        </div>
      );
    }

    // Single item display
    return (
      <Card className="p-4">
        <pre className="text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
      </Card>
    );
  };

  const handleSave = () => {
    onUpdate(block.content, block.style);
    // Update config through parent component
    setIsEditing(false);
  };

  if (!isEditable) {
    return <div className="dynamic-block-content">{renderContent()}</div>;
  }

  return (
    <div className="relative border-2 border-dashed border-purple-300 rounded-lg p-4 group">
      {/* Control Bar */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="bg-white shadow-sm"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          className="shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Settings Panel */}
      {isEditing && (
        <div className="absolute top-12 right-2 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-20 w-96 max-h-96 overflow-y-auto">
          <h3 className="font-semibold mb-3 flex items-center">
            <Code className="w-4 h-4 mr-2" />
            Dynamic Block Configuration
          </h3>
          
          <div className="space-y-3">
            {/* Template Info */}
            <div>
              <Label>Template Name</Label>
              <Input
                type="text"
                placeholder="my-template"
                value={editConfig.templateName || ''}
                onChange={(e) => setEditConfig({ ...editConfig, templateName: e.target.value })}
              />
            </div>

            {/* Data Source Configuration */}
            <div className="border-t pt-3">
              <h4 className="font-medium mb-2">Data Source</h4>
              
              <div className="space-y-2">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={editConfig.dataSource?.type || 'static'}
                    onValueChange={(value) => setEditConfig({
                      ...editConfig,
                      dataSource: { ...editConfig.dataSource, type: value as any }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="static">Static Data</SelectItem>
                      <SelectItem value="api">REST API</SelectItem>
                      <SelectItem value="graphql">GraphQL</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(editConfig.dataSource?.type === 'api' || editConfig.dataSource?.type === 'graphql') && (
                  <div>
                    <Label>Endpoint</Label>
                    <Input
                      type="text"
                      placeholder="/api/data or /graphql"
                      value={editConfig.dataSource?.endpoint || ''}
                      onChange={(e) => setEditConfig({
                        ...editConfig,
                        dataSource: { ...editConfig.dataSource, endpoint: e.target.value }
                      })}
                    />
                  </div>
                )}

                {editConfig.dataSource?.type === 'graphql' && (
                  <div>
                    <Label>GraphQL Query</Label>
                    <Textarea
                      placeholder="query GetData { items { id name } }"
                      value={editConfig.dataSource?.query || ''}
                      onChange={(e) => setEditConfig({
                        ...editConfig,
                        dataSource: { ...editConfig.dataSource, query: e.target.value }
                      })}
                      rows={3}
                    />
                  </div>
                )}

                {editConfig.dataSource?.type === 'static' && (
                  <div>
                    <Label>Static Data (JSON)</Label>
                    <Textarea
                      placeholder='{"items": [{"id": 1, "name": "Item 1"}]}'
                      value={JSON.stringify(editConfig.dataSource?.staticData || {}, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setEditConfig({
                            ...editConfig,
                            dataSource: { ...editConfig.dataSource, staticData: parsed }
                          });
                        } catch (err) {
                          // Invalid JSON, ignore
                        }
                      }}
                      rows={4}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Repeater Configuration */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <Label>Enable Repeater</Label>
                <Switch
                  checked={editConfig.repeater?.enabled || false}
                  onCheckedChange={(checked) => setEditConfig({
                    ...editConfig,
                    repeater: { ...editConfig.repeater, enabled: checked }
                  })}
                />
              </div>

              {editConfig.repeater?.enabled && (
                <div className="space-y-2">
                  <div>
                    <Label>Data Path</Label>
                    <Input
                      type="text"
                      placeholder="data.items"
                      value={editConfig.repeater?.dataPath || ''}
                      onChange={(e) => setEditConfig({
                        ...editConfig,
                        repeater: { ...editConfig.repeater, dataPath: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <Label>Limit</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={editConfig.repeater?.limit || ''}
                      onChange={(e) => setEditConfig({
                        ...editConfig,
                        repeater: { ...editConfig.repeater, limit: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="flex-1">
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Content Display */}
      <div className="mt-8">
        <div className="text-xs text-gray-500 mb-2 flex items-center">
          <Code className="w-3 h-3 mr-1" />
          Dynamic Block
          {config?.templateName && ` - ${config.templateName}`}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};
