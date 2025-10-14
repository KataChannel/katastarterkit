'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { X, Paintbrush, Settings, Type, Palette, Move, Square, Image as ImageIcon, Sparkles } from 'lucide-react';
import {
  TypographyEditor,
  ColorEditor,
  SpacingEditor,
  BorderEditor,
  BackgroundEditor,
  ShadowEditor,
} from './editors';

interface RightPanelProps {
  selectedBlockId: string | null;
  device: 'desktop' | 'tablet' | 'mobile';
  onClose: () => void;
}

export function RightPanel({ selectedBlockId, device, onClose }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<'style' | 'settings'>('style');
  
  // Mock style state (in real app, this would come from context)
  const [typography, setTypography] = useState({});
  const [colors, setColors] = useState({});
  const [spacing, setSpacing] = useState({});
  const [border, setBorder] = useState({});
  const [background, setBackground] = useState({});
  const [shadow, setShadow] = useState({});

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Panel Header */}
      <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4">
        <h2 className="font-semibold">Properties</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {selectedBlockId ? (
        <>
          {/* Device Indicator */}
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <p className="text-xs text-gray-500">
              Editing for: <span className="font-semibold capitalize">{device}</span>
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="style" className="flex-1 gap-2">
                <Paintbrush className="w-4 h-4" />
                Style
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              {/* Style Tab */}
              <TabsContent value="style" className="mt-0">
                <Accordion type="multiple" defaultValue={['typography', 'colors']} className="w-full">
                  {/* Typography */}
                  <AccordionItem value="typography">
                    <AccordionTrigger className="px-4 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        <span>Typography</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <TypographyEditor settings={typography} onChange={setTypography} device={device} />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Colors */}
                  <AccordionItem value="colors">
                    <AccordionTrigger className="px-4 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        <span>Colors</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <ColorEditor settings={colors} onChange={setColors} />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Spacing */}
                  <AccordionItem value="spacing">
                    <AccordionTrigger className="px-4 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Move className="w-4 h-4" />
                        <span>Spacing</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <SpacingEditor settings={spacing} onChange={setSpacing} />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Border */}
                  <AccordionItem value="border">
                    <AccordionTrigger className="px-4 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Square className="w-4 h-4" />
                        <span>Border</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <BorderEditor settings={border} onChange={setBorder} />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Background */}
                  <AccordionItem value="background">
                    <AccordionTrigger className="px-4 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>Background</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <BackgroundEditor settings={background} onChange={setBackground} />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Shadow */}
                  <AccordionItem value="shadow">
                    <AccordionTrigger className="px-4 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Shadow</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <ShadowEditor settings={shadow} onChange={setShadow} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-0 p-4">
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Selected: <span className="font-mono text-xs">{selectedBlockId}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Block-specific settings will appear here based on block type.
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-gray-500 text-center">
            Select a block to edit its properties
          </p>
        </div>
      )}
    </div>
  );
}
