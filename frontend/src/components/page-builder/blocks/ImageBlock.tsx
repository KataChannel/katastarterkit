import React, { useState } from 'react';
import { Edit3, Trash2, Upload } from 'lucide-react';
import { PageBlock, ImageBlockContent } from '@/types/page-builder';

interface ImageBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate?: (content: any, style?: any) => void;
  onDelete?: () => void;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
  block,
  isEditable = false,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<ImageBlockContent>(block.content);

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
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="url"
              value={content.src || ''}
              onChange={(e) => setContent(prev => ({ ...prev, src: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Alt Text</label>
            <input
              type="text"
              value={content.alt || ''}
              onChange={(e) => setContent(prev => ({ ...prev, alt: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="Describe the image..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Caption (Optional)</label>
            <input
              type="text"
              value={content.caption || ''}
              onChange={(e) => setContent(prev => ({ ...prev, caption: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="Image caption..."
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Width</label>
              <input
                type="number"
                value={content.width || ''}
                onChange={(e) => setContent(prev => ({ ...prev, width: parseInt(e.target.value) || undefined }))}
                className="w-full p-1 border rounded text-sm"
                placeholder="Auto"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Height</label>
              <input
                type="number"
                value={content.height || ''}
                onChange={(e) => setContent(prev => ({ ...prev, height: parseInt(e.target.value) || undefined }))}
                className="w-full p-1 border rounded text-sm"
                placeholder="Auto"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fit</label>
              <select
                value={content.objectFit || 'cover'}
                onChange={(e) => setContent(prev => ({ ...prev, objectFit: e.target.value as any }))}
                className="w-full p-1 border rounded text-sm"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
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

  if (!content.src) {
    return (
      <div 
        className={`relative group border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${
          isEditable ? 'hover:ring-2 hover:ring-blue-300 cursor-pointer' : ''
        }`}
        onClick={() => isEditable && setIsEditing(true)}
      >
        <Upload className="mx-auto mb-2 text-gray-400" size={48} />
        <p className="text-gray-500">Click to add an image</p>
        
        {isEditable && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative group ${isEditable ? 'hover:ring-2 hover:ring-blue-300' : ''}`}>
      <div className="text-center">
        <img
          src={content.src}
          alt={content.alt || ''}
          style={{
            width: content.width ? `${content.width}px` : 'auto',
            height: content.height ? `${content.height}px` : 'auto',
            objectFit: content.objectFit || 'cover',
            maxWidth: '100%',
          }}
          className="mx-auto rounded-lg"
        />
        {content.caption && (
          <p className="mt-2 text-sm text-gray-600 italic">{content.caption}</p>
        )}
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