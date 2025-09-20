import React, { useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { PageBlock, TextBlockContent } from '@/types/page-builder';

interface TextBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate?: (content: any, style?: any) => void;
  onDelete?: () => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  block,
  isEditable = false,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<TextBlockContent>(block.content);

  const handleSave = () => {
    onUpdate?.(content, block.style);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(block.content);
    setIsEditing(false);
  };

  if (isEditing && isEditable) {
    return (
      <div className="relative border-2 border-blue-500 rounded-lg p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Text Content</label>
            <textarea
              value={content.text || ''}
              onChange={(e) => setContent(prev => ({ ...prev, text: e.target.value }))}
              className="w-full p-2 border rounded resize-none"
              rows={4}
              placeholder="Enter your text here..."
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Font Size</label>
              <input
                type="number"
                value={content.fontSize || 16}
                onChange={(e) => setContent(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                className="w-full p-1 border rounded text-sm"
                min="8"
                max="72"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Weight</label>
              <select
                value={content.fontWeight || 'normal'}
                onChange={(e) => setContent(prev => ({ ...prev, fontWeight: e.target.value }))}
                className="w-full p-1 border rounded text-sm"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="light">Light</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Align</label>
              <select
                value={content.textAlign || 'left'}
                onChange={(e) => setContent(prev => ({ ...prev, textAlign: e.target.value as any }))}
                className="w-full p-1 border rounded text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative group ${isEditable ? 'hover:ring-2 hover:ring-blue-300' : ''}`}
      style={block.style}
    >
      <div
        style={{
          fontSize: content.fontSize || 16,
          fontWeight: content.fontWeight || 'normal',
          textAlign: content.textAlign || 'left',
          color: content.color || 'inherit',
        }}
      >
        {content.text || 'Click to edit text...'}
      </div>
      
      {isEditable && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              title="Edit"
            >
              <Edit3 size={12} />
            </button>
            <button
              onClick={onDelete}
              className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};