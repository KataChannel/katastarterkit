'use client';

import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BreakpointSelector, Breakpoint } from './BreakpointSelector';
import { LayoutEditor } from './LayoutEditor';
import { VisualSpacingEditor } from './VisualSpacingEditor';
import { BorderEditor } from './BorderEditor';
import { AdvancedColorPicker } from './AdvancedColorPicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface StylePanelProps {
  selectedBlock: any;
  onStyleChange: (styles: Record<string, any>) => void;
}

export function StylePanel({ selectedBlock, onStyleChange }: StylePanelProps) {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');
  
  if (!selectedBlock) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Select a block to edit its styles
      </div>
    );
  }

  const currentStyles = selectedBlock.styles || {};

  const handleStyleUpdate = (updates: Record<string, any>) => {
    onStyleChange({ ...currentStyles, ...updates });
  };

  return (
    <div className="space-y-3 p-3">
      {/* Breakpoint Selector */}
      <BreakpointSelector value={breakpoint} onChange={setBreakpoint} />

      {/* Style Editors */}
      <Accordion type="multiple" defaultValue={['layout', 'spacing', 'typography', 'colors']} className="w-full">
        {/* Layout Section */}
        <AccordionItem value="layout">
          <AccordionTrigger className="text-sm font-semibold">🎨 Layout</AccordionTrigger>
          <AccordionContent>
            <LayoutEditor
              value={{
                display: currentStyles.display,
                flexDirection: currentStyles.flexDirection,
                justifyContent: currentStyles.justifyContent,
                alignItems: currentStyles.alignItems,
                gap: currentStyles.gap,
                gridTemplateColumns: currentStyles.gridTemplateColumns,
                gridTemplateRows: currentStyles.gridTemplateRows,
                flexWrap: currentStyles.flexWrap,
              }}
              onChange={(layout) => handleStyleUpdate(layout)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Spacing Section */}
        <AccordionItem value="spacing">
          <AccordionTrigger className="text-sm font-semibold">📐 Spacing</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium mb-2 block">Padding</Label>
                <VisualSpacingEditor
                  type="padding"
                  value={{
                    top: currentStyles.paddingTop || 0,
                    right: currentStyles.paddingRight || 0,
                    bottom: currentStyles.paddingBottom || 0,
                    left: currentStyles.paddingLeft || 0,
                  }}
                  onChange={(padding) =>
                    handleStyleUpdate({
                      paddingTop: padding.top,
                      paddingRight: padding.right,
                      paddingBottom: padding.bottom,
                      paddingLeft: padding.left,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-xs font-medium mb-2 block">Margin</Label>
                <VisualSpacingEditor
                  type="margin"
                  value={{
                    top: currentStyles.marginTop || 0,
                    right: currentStyles.marginRight || 0,
                    bottom: currentStyles.marginBottom || 0,
                    left: currentStyles.marginLeft || 0,
                  }}
                  onChange={(margin) =>
                    handleStyleUpdate({
                      marginTop: margin.top,
                      marginRight: margin.right,
                      marginBottom: margin.bottom,
                      marginLeft: margin.left,
                    })
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Typography Section */}
        <AccordionItem value="typography">
          <AccordionTrigger className="text-sm font-semibold">✍️ Typography</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Font Size */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Font Size</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="8"
                    max="72"
                    value={parseInt(currentStyles.fontSize || 16)}
                    onChange={(e) => handleStyleUpdate({ fontSize: `${e.target.value}px` })}
                    className="h-8 text-xs"
                  />
                  <span className="text-xs text-gray-500">px</span>
                </div>
              </div>

              {/* Font Weight */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Font Weight</Label>
                <select
                  value={currentStyles.fontWeight || 'normal'}
                  onChange={(e) => handleStyleUpdate({ fontWeight: e.target.value })}
                  className="w-full h-8 px-2 text-xs border rounded-md"
                >
                  <option value="100">Thin</option>
                  <option value="300">Light</option>
                  <option value="normal">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="bold">Bold</option>
                  <option value="800">Extra Bold</option>
                </select>
              </div>

              {/* Line Height */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Line Height</Label>
                <Input
                  type="number"
                  min="1"
                  max="3"
                  step="0.1"
                  value={parseFloat(currentStyles.lineHeight || 1.5)}
                  onChange={(e) => handleStyleUpdate({ lineHeight: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>

              {/* Text Align */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Text Align</Label>
                <div className="grid grid-cols-4 gap-1">
                  {['left', 'center', 'right', 'justify'].map((align) => (
                    <Button
                      key={align}
                      variant={currentStyles.textAlign === align ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStyleUpdate({ textAlign: align })}
                      className="h-8 text-xs capitalize"
                    >
                      {align}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Colors Section */}
        <AccordionItem value="colors">
          <AccordionTrigger className="text-sm font-semibold">🎨 Colors</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <AdvancedColorPicker
                label="Text Color"
                value={currentStyles.color || '#000000'}
                onChange={(color) => handleStyleUpdate({ color })}
                showOpacity={true}
              />
              <AdvancedColorPicker
                label="Background Color"
                value={currentStyles.backgroundColor || '#ffffff'}
                onChange={(backgroundColor) => handleStyleUpdate({ backgroundColor })}
                showOpacity={true}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Border Section */}
        <AccordionItem value="border">
          <AccordionTrigger className="text-sm font-semibold">🔲 Border</AccordionTrigger>
          <AccordionContent>
            <BorderEditor
              value={{
                width: parseInt(currentStyles.borderWidth || 0),
                style: currentStyles.borderStyle || 'solid',
                color: currentStyles.borderColor || '#000000',
                radius: {
                  topLeft: parseInt(currentStyles.borderTopLeftRadius || 0),
                  topRight: parseInt(currentStyles.borderTopRightRadius || 0),
                  bottomRight: parseInt(currentStyles.borderBottomRightRadius || 0),
                  bottomLeft: parseInt(currentStyles.borderBottomLeftRadius || 0),
                },
              }}
              onChange={(border) =>
                handleStyleUpdate({
                  borderWidth: `${border.width}px`,
                  borderStyle: border.style,
                  borderColor: border.color,
                  borderTopLeftRadius: `${border.radius?.topLeft || 0}px`,
                  borderTopRightRadius: `${border.radius?.topRight || 0}px`,
                  borderBottomRightRadius: `${border.radius?.bottomRight || 0}px`,
                  borderBottomLeftRadius: `${border.radius?.bottomLeft || 0}px`,
                })
              }
            />
          </AccordionContent>
        </AccordionItem>

        {/* Effects Section */}
        <AccordionItem value="effects">
          <AccordionTrigger className="text-sm font-semibold">✨ Effects</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Opacity */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Opacity</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parseFloat(currentStyles.opacity || 1) * 100}
                    onChange={(e) => handleStyleUpdate({ opacity: parseInt(e.target.value) / 100 })}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs w-10 text-right">
                    {Math.round(parseFloat(currentStyles.opacity || 1) * 100)}%
                  </span>
                </div>
              </div>

              {/* Box Shadow */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Shadow</Label>
                <select
                  value={currentStyles.boxShadow || 'none'}
                  onChange={(e) => handleStyleUpdate({ boxShadow: e.target.value })}
                  className="w-full h-8 px-2 text-xs border rounded-md"
                >
                  <option value="none">None</option>
                  <option value="0 1px 2px 0 rgb(0 0 0 / 0.05)">Small</option>
                  <option value="0 4px 6px -1px rgb(0 0 0 / 0.1)">Medium</option>
                  <option value="0 10px 15px -3px rgb(0 0 0 / 0.1)">Large</option>
                  <option value="0 20px 25px -5px rgb(0 0 0 / 0.1)">Extra Large</option>
                  <option value="0 25px 50px -12px rgb(0 0 0 / 0.25)">2XL</option>
                </select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size Section */}
        <AccordionItem value="size">
          <AccordionTrigger className="text-sm font-semibold">📏 Size</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Width */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Width</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={currentStyles.width || 'auto'}
                    onChange={(e) => handleStyleUpdate({ width: e.target.value })}
                    placeholder="auto, 100%, 300px"
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Height</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={currentStyles.height || 'auto'}
                    onChange={(e) => handleStyleUpdate({ height: e.target.value })}
                    placeholder="auto, 100%, 300px"
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              {/* Min/Max Width */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Min Width</Label>
                  <Input
                    value={currentStyles.minWidth || ''}
                    onChange={(e) => handleStyleUpdate({ minWidth: e.target.value })}
                    placeholder="0"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Max Width</Label>
                  <Input
                    value={currentStyles.maxWidth || ''}
                    onChange={(e) => handleStyleUpdate({ maxWidth: e.target.value })}
                    placeholder="none"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
