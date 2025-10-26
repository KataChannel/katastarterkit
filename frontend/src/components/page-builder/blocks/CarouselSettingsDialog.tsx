'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from 'lucide-react';

interface CarouselSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: {
    autoPlay: boolean;
    autoPlayInterval: number;
    showIndicators: boolean;
    showArrows: boolean;
    loop: boolean;
    height: string;
    transition: string;
    indicatorStyle: string;
    arrowStyle: string;
    itemsPerSlide?: number;
  };
  onSave: (settings: any) => void;
}

export function CarouselSettingsDialog({ open, onOpenChange, settings, onSave }: CarouselSettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Carousel Settings
          </DialogTitle>
          <DialogDescription>
            Customize your carousel behavior and appearance
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="behavior" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="behavior" className="space-y-4 mt-4">
            {/* Auto Play */}
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="autoPlay">Auto Play</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically advance slides
                </p>
              </div>
              <Switch
                id="autoPlay"
                checked={localSettings.autoPlay}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, autoPlay: checked })
                }
              />
            </div>

            {/* Auto Play Interval */}
            {localSettings.autoPlay && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoPlayInterval">Slide Duration</Label>
                  <span className="text-sm text-muted-foreground">
                    {localSettings.autoPlayInterval / 1000}s
                  </span>
                </div>
                <Input
                  id="autoPlayInterval"
                  type="range"
                  min={2000}
                  max={10000}
                  step={500}
                  value={localSettings.autoPlayInterval}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocalSettings({ ...localSettings, autoPlayInterval: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Time each slide is displayed (2-10 seconds)
                </p>
              </div>
            )}

            {/* Loop */}
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="loop">Loop</Label>
                <p className="text-sm text-muted-foreground">
                  Return to first slide after last
                </p>
              </div>
              <Switch
                id="loop"
                checked={localSettings.loop}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, loop: checked })
                }
              />
            </div>

            {/* Transition Effect */}
            <div className="space-y-2">
              <Label htmlFor="transition">Transition Effect</Label>
              <Select
                value={localSettings.transition}
                onValueChange={(value) =>
                  setLocalSettings({ ...localSettings, transition: value })
                }
              >
                <SelectTrigger id="transition">
                  <SelectValue placeholder="Select transition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 mt-4">
            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height">Carousel Height</Label>
              <Select
                value={localSettings.height}
                onValueChange={(value) =>
                  setLocalSettings({ ...localSettings, height: value })
                }
              >
                <SelectTrigger id="height">
                  <SelectValue placeholder="Select height" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="sm">Small (300px)</SelectItem>
                  <SelectItem value="md">Medium (400px)</SelectItem>
                  <SelectItem value="lg">Large (500px)</SelectItem>
                  <SelectItem value="xl">Extra Large (600px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items Per Slide */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="itemsPerSlide">Items Per Slide</Label>
                <span className="text-sm text-muted-foreground font-semibold">
                  {localSettings.itemsPerSlide || 1}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() =>
                      setLocalSettings({ ...localSettings, itemsPerSlide: num })
                    }
                    className={`flex-1 py-2 px-3 rounded-md border-2 transition-colors ${
                      (localSettings.itemsPerSlide || 1) === num
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Number of items to display in one slide. Use more items for gallery-style carousels.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="controls" className="space-y-4 mt-4">
            {/* Show Arrows */}
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="showArrows">Show Navigation Arrows</Label>
                <p className="text-sm text-muted-foreground">
                  Display previous/next buttons
                </p>
              </div>
              <Switch
                id="showArrows"
                checked={localSettings.showArrows}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, showArrows: checked })
                }
              />
            </div>

            {/* Arrow Style */}
            {localSettings.showArrows && (
              <div className="space-y-2">
                <Label htmlFor="arrowStyle">Arrow Style</Label>
                <Select
                  value={localSettings.arrowStyle}
                  onValueChange={(value) =>
                    setLocalSettings({ ...localSettings, arrowStyle: value })
                  }
                >
                  <SelectTrigger id="arrowStyle">
                    <SelectValue placeholder="Select arrow style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Show Indicators */}
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="showIndicators">Show Indicators</Label>
                <p className="text-sm text-muted-foreground">
                  Display slide position indicators
                </p>
              </div>
              <Switch
                id="showIndicators"
                checked={localSettings.showIndicators}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, showIndicators: checked })
                }
              />
            </div>

            {/* Indicator Style */}
            {localSettings.showIndicators && (
              <div className="space-y-2">
                <Label htmlFor="indicatorStyle">Indicator Style</Label>
                <Select
                  value={localSettings.indicatorStyle}
                  onValueChange={(value) =>
                    setLocalSettings({ ...localSettings, indicatorStyle: value })
                  }
                >
                  <SelectTrigger id="indicatorStyle">
                    <SelectValue placeholder="Select indicator style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="lines">Lines</SelectItem>
                    <SelectItem value="numbers">Numbers</SelectItem>
                    <SelectItem value="thumbnails">Thumbnails</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
