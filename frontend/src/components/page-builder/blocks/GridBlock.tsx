import React from 'react';
import { PageBlock, GridBlockContent } from '@/types/page-builder';
import { Settings, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GridBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
  onAddChild?: () => void;
  children?: React.ReactNode;
}

export const GridBlock: React.FC<GridBlockProps> = ({
  block,
  isEditable = true,
  onUpdate,
  onDelete,
  onAddChild,
  children,
}) => {
  const content = block.content as GridBlockContent;
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState<GridBlockContent>(content || {
    columns: 3,
    gap: 16,
    responsive: {
      sm: 1,
      md: 2,
      lg: 3,
    },
  });

  const handleSave = () => {
    onUpdate(editContent);
    setIsEditing(false);
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: content.columnTemplate || `repeat(${content.columns || 3}, 1fr)`,
    gridTemplateRows: content.rowTemplate || 'auto',
    gap: `${content.gap || 16}px`,
    width: '100%',
    position: 'relative',
    minHeight: children ? 'auto' : '200px',
    border: isEditable ? '2px dashed #cbd5e0' : 'none',
    borderRadius: '8px',
    padding: isEditable ? '16px' : '0',
  };

  if (!isEditable) {
    return (
      <div style={gridStyles} className="page-grid">
        {children}
      </div>
    );
  }

  return (
    <div style={gridStyles} className="group page-grid">
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
          <h3 className="font-semibold mb-3">Grid Settings</h3>
          
          <div className="space-y-3">
            <div>
              <Label>Columns (Desktop)</Label>
              <Input
                type="number"
                min="1"
                max="12"
                value={editContent.columns || 3}
                onChange={(e) => setEditContent({ ...editContent, columns: parseInt(e.target.value) })}
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

            <div>
              <Label>Custom Column Template (optional)</Label>
              <Input
                type="text"
                placeholder="e.g., 2fr 1fr 1fr"
                value={editContent.columnTemplate || ''}
                onChange={(e) => setEditContent({ ...editContent, columnTemplate: e.target.value })}
              />
            </div>

            <div>
              <Label>Custom Row Template (optional)</Label>
              <Input
                type="text"
                placeholder="e.g., auto auto"
                value={editContent.rowTemplate || ''}
                onChange={(e) => setEditContent({ ...editContent, rowTemplate: e.target.value })}
              />
            </div>

            <div className="pt-2 border-t">
              <h4 className="font-medium mb-2">Responsive Columns</h4>
              
              <div className="space-y-2">
                <div>
                  <Label className="text-sm">Small (sm)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={editContent.responsive?.sm || 1}
                    onChange={(e) => setEditContent({
                      ...editContent,
                      responsive: { ...editContent.responsive, sm: parseInt(e.target.value) }
                    })}
                  />
                </div>

                <div>
                  <Label className="text-sm">Medium (md)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={editContent.responsive?.md || 2}
                    onChange={(e) => setEditContent({
                      ...editContent,
                      responsive: { ...editContent.responsive, md: parseInt(e.target.value) }
                    })}
                  />
                </div>

                <div>
                  <Label className="text-sm">Large (lg)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={editContent.responsive?.lg || 3}
                    onChange={(e) => setEditContent({
                      ...editContent,
                      responsive: { ...editContent.responsive, lg: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>
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
        <div className="col-span-full text-gray-400 text-center py-8">
          Drop blocks here or click "Add Block" to add child blocks to grid cells
        </div>
      )}

      <style jsx>{`
        @media (max-width: 640px) {
          .page-grid {
            grid-template-columns: repeat(${content.responsive?.sm || 1}, 1fr) !important;
          }
        }
        @media (min-width: 641px) and (max-width: 768px) {
          .page-grid {
            grid-template-columns: repeat(${content.responsive?.md || 2}, 1fr) !important;
          }
        }
        @media (min-width: 769px) {
          .page-grid {
            grid-template-columns: repeat(${content.responsive?.lg || content.columns || 3}, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};
