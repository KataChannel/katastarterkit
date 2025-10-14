'use client';

import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import type { PageBlock } from '@/types/page-builder';

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
}

interface CarouselBlockProps {
  block: PageBlock;
  isEditing?: boolean;
  onUpdate?: (blockId: string, content: any, style?: any) => void;
}

export default function CarouselBlock({ block, isEditing, onUpdate }: CarouselBlockProps) {
  const [api, setApi] = useState<any>();
  const [currentSlide, setCurrentSlide] = useState(0);

  const content = block.content || {};
  const slides: CarouselSlide[] = content.slides || [];
  const autoPlay = content.autoPlay !== false; // Default true
  const autoPlayInterval = content.autoPlayInterval || 5000; // Default 5s
  const showIndicators = content.showIndicators !== false; // Default true
  const showArrows = content.showArrows !== false; // Default true
  const loop = content.loop !== false; // Default true

  // Auto-slide functionality
  useEffect(() => {
    if (!api || !autoPlay) return;

    const timer = setInterval(() => {
      api.scrollNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [api, autoPlay, autoPlayInterval]);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    onSelect();

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const handleEdit = () => {
    if (onUpdate) {
      // Open edit dialog or inline editor
      // For now, we'll just log
      console.log('Edit carousel:', block.id);
    }
  };

  // If no slides, show placeholder in edit mode
  if (slides.length === 0 && isEditing) {
    return (
      <div 
        className="relative p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[300px] flex items-center justify-center"
        style={block.style}
      >
        <div className="text-center">
          <p className="text-gray-500 mb-4">Carousel Block - No slides added</p>
          <Button onClick={handleEdit} size="sm">
            <Pencil className="w-4 h-4 mr-2" />
            Add Slides
          </Button>
        </div>
      </div>
    );
  }

  // If no slides in preview mode, don't render
  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative" style={block.style}>
      {isEditing && (
        <Button
          onClick={handleEdit}
          size="sm"
          variant="outline"
          className="absolute top-2 right-2 z-10 bg-white"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit Carousel
        </Button>
      )}

      <Carousel 
        className="w-full mx-auto"
        setApi={setApi}
        opts={{
          align: "start",
          loop: loop,
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id || index}>
              <Card className="border-0 rounded-lg overflow-hidden">
                <CardContent className={`relative p-0 ${slide.bgColor || 'bg-gradient-to-r from-blue-500 to-purple-600'} overflow-hidden`}>
                  <div className="relative z-10 h-full flex items-center">
                    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Text Content */}
                        <div className="text-white space-y-4">
                          {slide.badge && (
                            <Badge variant="secondary" className="mb-2 text-sm font-semibold">
                              {slide.badge}
                            </Badge>
                          )}
                          
                          {slide.title && (
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                              {slide.title}
                            </h2>
                          )}
                          
                          {slide.subtitle && (
                            <p className="text-xl md:text-2xl font-semibold">
                              {slide.subtitle}
                            </p>
                          )}
                          
                          {slide.description && (
                            <p className="text-base md:text-lg opacity-90">
                              {slide.description}
                            </p>
                          )}
                          
                          {slide.cta && (
                            <div className="pt-4">
                              <Button 
                                size="lg" 
                                variant="secondary"
                                className="font-semibold hover:scale-105 transition-transform"
                                onClick={() => {
                                  if (slide.cta?.link && !isEditing) {
                                    window.location.href = slide.cta.link;
                                  }
                                }}
                              >
                                {slide.cta.text}
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Image */}
                        {slide.image && (
                          <div className="hidden md:block">
                            <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg shadow-2xl flex-shrink-0">
                              <img 
                                src={slide.image} 
                                alt={slide.title || 'Carousel slide'}
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Background Pattern/Overlay */}
                  <div className="absolute inset-0 bg-black/10 z-0" />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {showArrows && slides.length > 1 && (
          <>
            <CarouselPrevious className="left-4 bg-white/20 border-white/30 text-white hover:bg-white/40 transition-all duration-300 backdrop-blur-sm" />
            <CarouselNext className="right-4 bg-white/20 border-white/30 text-white hover:bg-white/40 transition-all duration-300 backdrop-blur-sm" />
          </>
        )}
      </Carousel>
      
      {/* Slide Indicators */}
      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`}
              onClick={() => {
                if (api) {
                  api.scrollTo(index);
                }
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
