'use client';

import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Pencil, Trash2, MoveUp, MoveDown, X } from 'lucide-react';
import type { PageBlock } from '@/types/page-builder';
import { CarouselSettingsDialog } from './CarouselSettingsDialog';
import { SlideEditorDialog } from './SlideEditorDialog';

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
  imageOverlay?: number; // 0-100
  animation?: 'fade' | 'slide' | 'zoom' | 'none';
  imageOnly?: boolean; // Show only image without text content
}

interface CarouselBlockProps {
  block: PageBlock;
  isEditing?: boolean;
  isEditable?: boolean;
  onUpdate?: (content: any, style?: any) => void;
  onDelete?: () => void;
}

export default function CarouselBlock({ block, isEditing, isEditable, onUpdate, onDelete }: CarouselBlockProps) {
  const [api, setApi] = useState<any>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showSlideEditor, setShowSlideEditor] = useState(false);
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  
  // Use isEditable if provided, fallback to isEditing for backwards compatibility
  const editMode = isEditable ?? isEditing ?? false;

  const content = block.content || {};
  const slides: CarouselSlide[] = content.slides || [];
  const autoPlay = content.autoPlay !== false; // Default true
  const autoPlayInterval = content.autoPlayInterval || 5000; // Default 5s
  const showIndicators = content.showIndicators !== false; // Default true
  const showArrows = content.showArrows !== false; // Default true
  const loop = content.loop !== false; // Default true
  const height = content.height || 'auto'; // auto, sm, md, lg, xl
  const transition = content.transition || 'slide'; // slide, fade, zoom
  const indicatorStyle = content.indicatorStyle || 'dots'; // dots, lines, numbers, thumbnails
  const arrowStyle = content.arrowStyle || 'default'; // default, circle, square, minimal
  const itemsPerSlide = content.itemsPerSlide || 1; // Default 1 item per slide

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
    setShowSettings(true);
  };

  const handleAddSlide = () => {
    const newSlide: CarouselSlide = {
      id: `slide-${Date.now()}`,
      title: 'New Slide',
      subtitle: '',
      description: '',
      image: '',
      bgColor: 'bg-gradient-to-r from-blue-500 to-purple-600',
      textColor: 'text-white',
      imagePosition: 'right',
      animation: 'slide',
    };
    
    const updatedSlides = [...slides, newSlide];
    onUpdate?.({ ...content, slides: updatedSlides }, block.style);
  };

  const handleEditSlide = (index: number) => {
    setEditingSlideIndex(index);
    setShowSlideEditor(true);
  };

  const handleDeleteSlide = (index: number) => {
    const updatedSlides = slides.filter((_, i) => i !== index);
    onUpdate?.({ ...content, slides: updatedSlides }, block.style);
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === slides.length - 1)
    ) {
      return;
    }

    const newSlides = [...slides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    
    onUpdate?.({ ...content, slides: newSlides }, block.style);
  };

  const handleSaveSlide = (slideData: CarouselSlide) => {
    if (editingSlideIndex === null) return;
    
    const updatedSlides = [...slides];
    updatedSlides[editingSlideIndex] = slideData;
    onUpdate?.({ ...content, slides: updatedSlides }, block.style);
    setShowSlideEditor(false);
    setEditingSlideIndex(null);
  };

  const handleSaveSettings = (settings: any) => {
    onUpdate?.({ ...content, ...settings }, block.style);
    setShowSettings(false);
  };

  const getHeightClass = () => {
    switch (height) {
      case 'sm': return 'h-[300px]';
      case 'md': return 'h-[400px]';
      case 'lg': return 'h-[500px]';
      case 'xl': return 'h-[600px]';
      default: return 'min-h-[400px]';
    }
  };

  const getItemBasisClass = () => {
    switch (itemsPerSlide) {
      case 2: return 'basis-1/2';
      case 3: return 'basis-1/3';
      case 4: return 'basis-1/4';
      case 5: return 'basis-1/5';
      case 6: return 'basis-1/6';
      default: return 'basis-full'; // 1 item per slide
    }
  };

  const getIndicatorComponent = () => {
    if (!showIndicators || slides.length <= 1) return null;

    switch (indicatorStyle) {
      case 'lines':
        return (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-6'
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        );
      
      case 'numbers':
        return (
          <div className="absolute bottom-4 right-4 z-10 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="font-semibold">{currentSlide + 1}</span>
            <span className="mx-1">/</span>
            <span>{slides.length}</span>
          </div>
        );
      
      case 'thumbnails':
        return (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 max-w-full overflow-x-auto px-4">
            {slides.map((slide, index) => (
              <button
                key={index}
                className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                  index === currentSlide ? 'border-white scale-110' : 'border-white/50 opacity-70'
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              >
                {slide.image ? (
                  <img src={slide.image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                    {index + 1}
                  </div>
                )}
              </button>
            ))}
          </div>
        );
      
      default: // dots
        return (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        );
    }
  };

  const getArrowClasses = () => {
    const baseClasses = "transition-all duration-300 backdrop-blur-sm";
    
    switch (arrowStyle) {
      case 'circle':
        return `${baseClasses} rounded-full bg-white/20 border-white/30 text-white hover:bg-white/40`;
      case 'square':
        return `${baseClasses} rounded-none bg-white/20 border-white/30 text-white hover:bg-white/40`;
      case 'minimal':
        return `${baseClasses} bg-transparent border-transparent text-white hover:bg-white/20`;
      default:
        return `${baseClasses} bg-white/20 border-white/30 text-white hover:bg-white/40`;
    }
  };

  // If no slides, show placeholder in edit mode
  if (slides.length === 0 && editMode) {
    return (
      <div 
        className="relative p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[300px] flex items-center justify-center"
        style={block.style}
      >
        <div className="text-center space-y-4">
          <p className="text-gray-500 mb-4">Carousel Block - No slides added</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleAddSlide} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add First Slide
            </Button>
            <Button onClick={handleEdit} size="sm" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // If no slides in preview mode, don't render
  if (slides.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`relative ${getHeightClass()}`} style={block.style}>
        {editMode && (
          <div className="absolute top-2 right-2 z-20 flex gap-2">
            <Button
              onClick={handleAddSlide}
              size="sm"
              variant="outline"
              className="bg-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
            <Button
              onClick={handleEdit}
              size="sm"
              variant="outline"
              className="bg-white shadow-lg"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              onClick={onDelete}
              size="sm"
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 text-white shadow-lg"
              title="Delete Carousel Block"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <Carousel 
          className="w-full h-full"
          setApi={setApi}
          opts={{
            align: "start",
            loop: loop,
            slidesToScroll: 1,
          }}
        >
          <CarouselContent className="h-full">
            {slides.map((slide, index) => {
              const slideTextColor = slide.textColor || 'text-white';
              const imagePos = (slide.imagePosition || 'right') as 'left' | 'right' | 'top' | 'bottom' | 'background' | 'fullscreen';
              
              return (
                <CarouselItem key={slide.id || index} className={`h-full ${getItemBasisClass()}`}>
                  <Card className="border-0 rounded-lg overflow-hidden h-full">
                    <CardContent className="relative p-0 overflow-hidden h-full">
                      {/* Image Only Mode - display only the image fullscreen */}
                      {slide.imageOnly && slide.image ? (
                        <div className="w-full h-full">
                          <img 
                            src={slide.image} 
                            alt={slide.title || 'Carousel slide'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <>
                          {/* Background Image with Overlay */}
                          {imagePos === 'background' && slide.image && (
                            <>
                              <div 
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.image})` }}
                              />
                              <div 
                                className="absolute inset-0 bg-black"
                                style={{ opacity: (slide.imageOverlay || 50) / 100 }}
                              />
                            </>
                          )}

                          <div className="relative z-10 h-full flex items-center">
                            {imagePos === 'fullscreen' && slide.image ? (
                              /* Fullscreen Image with Overlay Text */
                              <div className="w-full h-full">
                                <div 
                                  className="absolute inset-0 bg-cover bg-center"
                                  style={{ backgroundImage: `url(${slide.image})` }}
                                />
                                <div 
                                  className="absolute inset-0 bg-black"
                                  style={{ opacity: (slide.imageOverlay || 40) / 100 }}
                                />
                                <div className="relative z-10 w-full h-full flex items-center justify-center">
                                  <div className="container mx-auto px-4 md:px-8 text-center">
                                    {slide.badge && (
                                      <Badge variant="secondary" className="mb-4 text-sm font-semibold">
                                        {slide.badge}
                                      </Badge>
                                    )}
                                    
                                    {slide.title && (
                                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-white drop-shadow-lg">
                                        {slide.title}
                                      </h2>
                                    )}
                                    
                                    {slide.subtitle && (
                                      <p className="text-2xl md:text-3xl font-semibold mb-4 text-white drop-shadow-lg">
                                        {slide.subtitle}
                                      </p>
                                    )}
                                    
                                    {slide.description && (
                                      <p className="text-lg md:text-xl opacity-95 max-w-3xl mx-auto mb-6 text-white drop-shadow-lg">
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
                                            if (slide.cta?.link && !editMode) {
                                              window.location.href = slide.cta.link;
                                            }
                                          }}
                                        >
                                          {slide.cta.text}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
                          {/* Dynamic Layout based on image position */}
                          {imagePos === 'top' || imagePos === 'bottom' ? (
                            <div className={`space-y-6 ${imagePos === 'top' ? 'flex flex-col' : 'flex flex-col-reverse'}`}>
                              {/* Image */}
                              {slide.image && (
                                <div className="w-full">
                                  <div className="w-full h-48 md:h-64 overflow-hidden rounded-lg shadow-2xl">
                                    <img 
                                      src={slide.image} 
                                      alt={slide.title || 'Carousel slide'}
                                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                  </div>
                                </div>
                              )}
                              
                              {/* Text Content */}
                              <div className={`${slideTextColor} space-y-4 text-center`}>
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
                                  <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
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
                                        if (slide.cta?.link && !editMode) {
                                          window.location.href = slide.cta.link;
                                        }
                                      }}
                                    >
                                      {slide.cta.text}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className={`grid md:grid-cols-2 gap-8 items-center ${imagePos === 'left' ? 'md:flex-row-reverse' : ''}`}>
                              {/* Text Content */}
                              <div className={`${slideTextColor} space-y-4 ${imagePos === 'left' ? 'md:order-2' : ''}`}>
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
                                        if (slide.cta?.link && !editMode) {
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
                                <div className={`hidden md:block ${imagePos === 'left' ? 'md:order-1' : ''}`}>
                                  <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg shadow-2xl">
                                    <img 
                                      src={slide.image} 
                                      alt={slide.title || 'Carousel slide'}
                                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                      </>
                    )}

                    {editMode && (
                        <div className="absolute top-2 left-2 z-20 flex gap-2">
                          <Button
                            onClick={() => handleEditSlide(index)}
                            size="sm"
                            variant="outline"
                            className="bg-white shadow-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          {slides.length > 1 && (
                            <>
                              {index > 0 && (
                                <Button
                                  onClick={() => handleMoveSlide(index, 'up')}
                                  size="sm"
                                  variant="outline"
                                  className="bg-white shadow-lg"
                                >
                                  <MoveUp className="w-4 h-4" />
                                </Button>
                              )}
                              {index < slides.length - 1 && (
                                <Button
                                  onClick={() => handleMoveSlide(index, 'down')}
                                  size="sm"
                                  variant="outline"
                                  className="bg-white shadow-lg"
                                >
                                  <MoveDown className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                onClick={() => handleDeleteSlide(index)}
                                size="sm"
                                variant="destructive"
                                className="bg-red-500 shadow-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      )}

                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          {showArrows && slides.length > 1 && (
            <>
              <CarouselPrevious className={`left-4 ${getArrowClasses()}`} />
              <CarouselNext className={`right-4 ${getArrowClasses()}`} />
            </>
          )}
        </Carousel>
        
        {/* Slide Indicators */}
        {getIndicatorComponent()}
      </div>

      {/* Settings Dialog */}
      <CarouselSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={{
          autoPlay,
          autoPlayInterval,
          showIndicators,
          showArrows,
          loop,
          height,
          transition,
          indicatorStyle,
          arrowStyle,
          itemsPerSlide,
        }}
        onSave={handleSaveSettings}
      />

      {/* Slide Editor Dialog */}
      {editingSlideIndex !== null && (
        <SlideEditorDialog
          open={showSlideEditor}
          onOpenChange={setShowSlideEditor}
          slide={slides[editingSlideIndex]}
          onSave={handleSaveSlide}
        />
      )}
    </>
  );
}
