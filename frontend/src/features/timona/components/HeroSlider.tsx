'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

// Query để lấy featured posts cho slider
const GET_FEATURED_POSTS = gql`
  query GetFeaturedPosts($limit: Int) {
    posts(limit: $limit, isPublished: true) {
      id
      title
      slug
      excerpt
      featuredImage
      publishedAt
    }
  }
`;

interface SlideData {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  buttonText?: string;
}

// Default slides khi chưa có dữ liệu từ API
const defaultSlides: SlideData[] = [
  {
    id: '1',
    title: 'HỌC VIỆN ĐÀO TẠO THẨM MỸ QUỐC TẾ',
    subtitle: 'Timona Academy - Nơi ươm mầm những chuyên gia làm đẹp hàng đầu',
    image: '/images/timona/hero-1.jpg',
    link: '/khoa-hoc',
    buttonText: 'XEM KHÓA HỌC',
  },
  {
    id: '2',
    title: 'ĐÀO TẠO CHUYÊN GIA SPA',
    subtitle: 'Chương trình đào tạo chuẩn quốc tế - Bằng cấp được công nhận toàn cầu',
    image: '/images/timona/hero-2.jpg',
    link: '/khoa-hoc/spa',
    buttonText: 'ĐĂNG KÝ NGAY',
  },
  {
    id: '3',
    title: 'PHUN XĂM THẨM MỸ CHUYÊN NGHIỆP',
    subtitle: 'Học từ những chuyên gia hàng đầu - Cam kết việc làm 100%',
    image: '/images/timona/hero-3.jpg',
    link: '/khoa-hoc/phun-xam',
    buttonText: 'TÌM HIỂU THÊM',
  },
];

interface HeroSliderProps {
  slides?: SlideData[];
  autoPlayInterval?: number;
}

export default function HeroSlider({ 
  slides: customSlides, 
  autoPlayInterval = 5000 
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Sử dụng custom slides hoặc default
  const slides = customSlides || defaultSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10s of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, autoPlayInterval]);

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00256e]/90 via-[#00256e]/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl">
                  {/* Title */}
                  <h1 
                    className={`text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight transition-all duration-700 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                    style={{ transitionDelay: '200ms' }}
                  >
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  {slide.subtitle && (
                    <p 
                      className={`text-xl md:text-2xl text-white/90 mb-8 leading-relaxed transition-all duration-700 ${
                        index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                      }`}
                      style={{ transitionDelay: '400ms' }}
                    >
                      {slide.subtitle}
                    </p>
                  )}

                  {/* CTA Button */}
                  {slide.link && (
                    <div 
                      className={`transition-all duration-700 ${
                        index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                      }`}
                      style={{ transitionDelay: '600ms' }}
                    >
                      <Link
                        href={slide.link}
                        className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all uppercase"
                      >
                        {slide.buttonText || 'XEM THÊM'}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20" />
    </section>
  );
}
