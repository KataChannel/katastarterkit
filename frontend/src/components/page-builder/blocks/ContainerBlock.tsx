import React from 'react';
import { PageBlock, ContainerBlockContent } from '@/types/page-builder';
import { Settings, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContainerBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
  onAddChild?: () => void;
  children?: React.ReactNode;
}

export const ContainerBlock: React.FC<ContainerBlockProps> = ({
  block,
  isEditable = true,
  onUpdate,
  onDelete,
  onAddChild,
  children,
}) => {
  const content = block.content as ContainerBlockContent;
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState<ContainerBlockContent>(content || {
    layout: 'stack',
    gap: 16,
    padding: 16,
    backgroundColor: 'transparent',
    maxWidth: '100%',
    alignment: 'left',
  });

  const handleSave = () => {
    onUpdate(editContent);
    setIsEditing(false);
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: content.layout === 'stack' ? 'column' : content.layout === 'wrap' ? 'row' : 'column',
    flexWrap: content.layout === 'wrap' ? 'wrap' : 'nowrap',
    gap: `${content.gap || 16}px`,
    padding: `${content.padding || 16}px`,
    backgroundColor: content.backgroundColor || 'transparent',
    maxWidth: content.maxWidth || '100%',
    alignItems: content.alignment === 'center' ? 'center' : content.alignment === 'right' ? 'flex-end' : 'flex-start',
    width: '100%',
    position: 'relative',
    minHeight: children ? 'auto' : '100px',
    border: isEditable ? '2px dashed #ccc' : 'none',
    borderRadius: '8px',
    overflow: content.layout === 'scroll' ? 'auto' : 'visible',
  };

  if (!isEditable) {
    return (
      <div style={containerStyles}>
        {children}
      </div>
    );
  }

  return (
    <div style={containerStyles} className="group">
      {/* Control Bar */}
      {isEditable && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {onAddChild && (
            <Button
              size="sm"
              variant="outline"
              onClick={onAddChild}
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
          <h3 className="font-semibold mb-3">Container Settings</h3>
          
          <div className="space-y-3">
            <div>
              <Label>Layout</Label>
              <Select
                value={editContent.layout || 'stack'}
                onValueChange={(value) => setEditContent({ ...editContent, layout: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stack">Stack (Vertical)</SelectItem>
                  <SelectItem value="wrap">Wrap (Horizontal)</SelectItem>
                  <SelectItem value="scroll">Scroll</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Gap (px)</Label>
              <Input
                type="number"
                value={editContent.gap || 16}
                onChange={(e) => setEditContent({ ...editContent, gap: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <Label>Padding (px)</Label>
              <Input
                type="number"
                value={editContent.padding || 16}
                onChange={(e) => setEditContent({ ...editContent, padding: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <Label>Background Color</Label>
              <Input
                type="text"
                placeholder="#ffffff or transparent"
                value={editContent.backgroundColor || 'transparent'}
                onChange={(e) => setEditContent({ ...editContent, backgroundColor: e.target.value })}
              />
            </div>

            <div>
              <Label>Max Width</Label>
              <Input
                type="text"
                placeholder="100% or 800px"
                value={editContent.maxWidth || '100%'}
                onChange={(e) => setEditContent({ ...editContent, maxWidth: e.target.value })}
              />
            </div>

            <div>
              <Label>Alignment</Label>
              <Select
                value={editContent.alignment || 'left'}
                onValueChange={(value) => setEditContent({ ...editContent, alignment: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
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
        <div className="text-gray-400 text-center py-8">
          Drop blocks here or click "Add Block" to add child blocks
        </div>
      )}
    </div>
  );
};
