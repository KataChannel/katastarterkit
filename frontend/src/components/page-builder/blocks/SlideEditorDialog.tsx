'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil } from 'lucide-react';

interface CarouselSlide {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  cta?: {
    text: string;
    link: string;
  };
  badge?: string;
  bgColor?: string;
  textColor?: string;
  imagePosition?: 'left' | 'right' | 'top' | 'bottom' | 'background' | 'fullscreen';
  imageOverlay?: number;
  animation?: 'fade' | 'slide' | 'zoom' | 'none';
  imageOnly?: boolean; // Show only image without text content
}

interface SlideEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide: CarouselSlide;
  onSave: (slide: CarouselSlide) => void;
}

export function SlideEditorDialog({ open, onOpenChange, slide, onSave }: SlideEditorDialogProps) {
  const [localSlide, setLocalSlide] = useState(slide);

  const handleSave = () => {
    onSave(localSlide);
  };

  const bgColorPresets = [
    { value: 'bg-gradient-to-r from-blue-500 to-purple-600', label: 'Blue to Purple' },
    { value: 'bg-gradient-to-r from-green-400 to-blue-500', label: 'Green to Blue' },
    { value: 'bg-gradient-to-r from-pink-500 to-yellow-500', label: 'Pink to Yellow' },
    { value: 'bg-gradient-to-r from-red-500 to-orange-500', label: 'Red to Orange' },
    { value: 'bg-gradient-to-r from-purple-400 to-pink-600', label: 'Purple to Pink' },
    { value: 'bg-gray-900', label: 'Dark Gray' },
    { value: 'bg-white', label: 'White' },
  ];

  const textColorPresets = [
    { value: 'text-white', label: 'White' },
    { value: 'text-black', label: 'Black' },
    { value: 'text-gray-900', label: 'Dark Gray' },
    { value: 'text-blue-600', label: 'Blue' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5" />
            Edit Slide
          </DialogTitle>
          <DialogDescription>
            Customize slide content and appearance
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="styling">Styling</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            {/* Badge */}
            <div className="space-y-2">
              <Label htmlFor="badge">Badge (Optional)</Label>
              <Input
                id="badge"
                value={localSlide.badge || ''}
                onChange={(e) =>
                  setLocalSlide({ ...localSlide, badge: e.target.value })
                }
                placeholder="e.g., NEW, SALE, HOT"
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={localSlide.title || ''}
                onChange={(e) =>
                  setLocalSlide({ ...localSlide, title: e.target.value })
                }
                placeholder="Enter slide title"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle (Optional)</Label>
              <Input
                id="subtitle"
                value={localSlide.subtitle || ''}
                onChange={(e) =>
                  setLocalSlide({ ...localSlide, subtitle: e.target.value })
                }
                placeholder="Enter slide subtitle"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={localSlide.description || ''}
                onChange={(e) =>
                  setLocalSlide({ ...localSlide, description: e.target.value })
                }
                placeholder="Enter slide description"
                rows={3}
              />
            </div>

            {/* CTA */}
            <div className="space-y-4 pt-2">
              <Label>Call to Action (Optional)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaText" className="text-sm">Button Text</Label>
                  <Input
                    id="ctaText"
                    value={localSlide.cta?.text || ''}
                    onChange={(e) =>
                      setLocalSlide({
                        ...localSlide,
                        cta: { ...localSlide.cta, text: e.target.value, link: localSlide.cta?.link || '' },
                      })
                    }
                    placeholder="e.g., Learn More"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaLink" className="text-sm">Button Link</Label>
                  <Input
                    id="ctaLink"
                    value={localSlide.cta?.link || ''}
                    onChange={(e) =>
                      setLocalSlide({
                        ...localSlide,
                        cta: { ...localSlide.cta, link: e.target.value, text: localSlide.cta?.text || '' },
                      })
                    }
                    placeholder="e.g., /products"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4 mt-4">
            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={localSlide.image || ''}
                onChange={(e) =>
                  setLocalSlide({ ...localSlide, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
              {localSlide.image && (
                <div className="mt-2 border rounded-lg overflow-hidden">
                  <img
                    src={localSlide.image}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Image Position */}
            <div className="space-y-2">
              <Label htmlFor="imagePosition">Image Position</Label>
              <Select
                value={localSlide.imagePosition || 'right'}
                onValueChange={(value: any) =>
                  setLocalSlide({ ...localSlide, imagePosition: value })
                }
              >
                <SelectTrigger id="imagePosition">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="background">Background</SelectItem>
                  <SelectItem value="fullscreen">Fullscreen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Only Mode */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="imageOnly">Image Only Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Show only the image without text content
                  </p>
                </div>
                <input
                  id="imageOnly"
                  type="checkbox"
                  checked={localSlide.imageOnly || false}
                  onChange={(e) =>
                    setLocalSlide({ ...localSlide, imageOnly: e.target.checked })
                  }
                  className="w-5 h-5 rounded border border-gray-300 cursor-pointer"
                />
              </div>
            </div>

            {/* Image Overlay (only for background) */}
            {localSlide.imagePosition === 'background' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="imageOverlay">Image Overlay</Label>
                  <span className="text-sm text-muted-foreground">
                    {localSlide.imageOverlay || 50}%
                  </span>
                </div>
                <Input
                  id="imageOverlay"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={localSlide.imageOverlay || 50}
                  onChange={(e) =>
                    setLocalSlide({ ...localSlide, imageOverlay: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Darkness of overlay on background image
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="styling" className="space-y-4 mt-4">
            {/* Background Color */}
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <Select
                value={localSlide.bgColor}
                onValueChange={(value) =>
                  setLocalSlide({ ...localSlide, bgColor: value })
                }
              >
                <SelectTrigger id="bgColor">
                  <SelectValue placeholder="Select background" />
                </SelectTrigger>
                <SelectContent>
                  {bgColorPresets.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${preset.value}`} />
                        {preset.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {localSlide.bgColor && (
                <div className={`w-full h-12 rounded ${localSlide.bgColor}`} />
              )}
            </div>

            {/* Text Color */}
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <Select
                value={localSlide.textColor}
                onValueChange={(value) =>
                  setLocalSlide({ ...localSlide, textColor: value })
                }
              >
                <SelectTrigger id="textColor">
                  <SelectValue placeholder="Select text color" />
                </SelectTrigger>
                <SelectContent>
                  {textColorPresets.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border ${preset.value} bg-current`} />
                        {preset.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Animation */}
            <div className="space-y-2">
              <Label htmlFor="animation">Animation</Label>
              <Select
                value={localSlide.animation || 'slide'}
                onValueChange={(value: any) =>
                  setLocalSlide({ ...localSlide, animation: value })
                }
              >
                <SelectTrigger id="animation">
                  <SelectValue placeholder="Select animation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Animation effect when slide appears
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Slide
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
