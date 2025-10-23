import React from 'react';
import { PageBlock, FlexBlockContent } from '@/types/page-builder';
import { Settings, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface FlexBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
  onAddChild?: (parentId: string) => void;
  children?: React.ReactNode;
}

export const FlexBlock: React.FC<FlexBlockProps> = ({
  block,
  isEditable = true,
  onUpdate,
  onDelete,
  onAddChild,
  children,
}) => {
  const content = block.content as FlexBlockContent;
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState<FlexBlockContent>(content || {
    direction: 'row',
    justifyContent: 'start',
    alignItems: 'start',
    wrap: false,
    gap: 16,
  });

  const handleSave = () => {
    onUpdate(editContent);
    setIsEditing(false);
  };

  const justifyContentMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
  };

  const alignItemsMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  };

  const flexStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: content.direction || 'row',
    justifyContent: justifyContentMap[content.justifyContent || 'start'],
    alignItems: alignItemsMap[content.alignItems || 'start'],
    flexWrap: content.wrap ? 'wrap' : 'nowrap',
    gap: `${content.gap || 16}px`,
    width: '100%',
    position: 'relative',
    minHeight: children ? 'auto' : '150px',
    border: isEditable ? '2px dashed #cbd5e0' : 'none',
    borderRadius: '8px',
    padding: isEditable ? '16px' : '0',
  };

  if (!isEditable) {
    return (
      <div style={flexStyles}>
        {children}
      </div>
    );
  }

  return (
    <div style={flexStyles} className="group">
      {/* Control Bar */}
      {isEditable && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {onAddChild && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddChild(block.id)}
              className="bg-white shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Block
            </Button>
          )}
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
      )}

      {/* Settings Panel */}
      {isEditing && (
        <div className="absolute top-12 right-2 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-20 w-80">
          <h3 className="font-semibold mb-3">Flex Container Settings</h3>
          
          <div className="space-y-3">
            <div>
              <Label>Direction</Label>
              <Select
                value={editContent.direction || 'row'}
                onValueChange={(value) => setEditContent({ ...editContent, direction: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="row">Row (Horizontal)</SelectItem>
                  <SelectItem value="column">Column (Vertical)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Justify Content</Label>
              <Select
                value={editContent.justifyContent || 'start'}
                onValueChange={(value) => setEditContent({ ...editContent, justifyContent: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="end">End</SelectItem>
                  <SelectItem value="between">Space Between</SelectItem>
                  <SelectItem value="around">Space Around</SelectItem>
                  <SelectItem value="evenly">Space Evenly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Align Items</Label>
              <Select
                value={editContent.alignItems || 'start'}
                onValueChange={(value) => setEditContent({ ...editContent, alignItems: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="end">End</SelectItem>
                  <SelectItem value="stretch">Stretch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Wrap Items</Label>
              <Switch
                checked={editContent.wrap || false}
                onCheckedChange={(checked) => setEditContent({ ...editContent, wrap: checked })}
              />
            </div>

            <div>
              <Label>Gap (px)</Label>
              <Input
                type="number"
                value={editContent.gap || 16}
                onChange={(e) => setEditContent({ ...editContent, gap: parseInt(e.target.value) })}
              />
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

      {/* Children Blocks */}
      {children || (
        <div className="text-gray-400 text-center py-8 flex-1">
          Drop blocks here or click "Add Block" to add child blocks
        </div>
      )}
    </div>
  );
};
