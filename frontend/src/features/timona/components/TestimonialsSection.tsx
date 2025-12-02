'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACADEMY_TESTIMONIALS } from '../graphql/queries';
import type { AcademyTestimonial } from '../types';

// Placeholder avatar
const placeholderAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IiM2NDc0OGIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5IVjwvdGV4dD48L3N2Zz4=';

interface TestimonialCardProps {
  testimonial: AcademyTestimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Quote Icon */}
      <div className="text-[#00256e] mb-4">
        <svg className="w-10 h-10 opacity-30" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Content */}
      <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
        "{testimonial.content}"
      </p>

      {/* Rating */}
      {testimonial.rating && (
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-5 h-5 ${
                star <= testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}

      {/* Student Info */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <img
          src={testimonial.studentAvatar || placeholderAvatar}
          alt={testimonial.studentName}
          className="w-14 h-14 rounded-full object-cover border-2 border-[#00256e]/20"
          onError={(e) => {
            e.currentTarget.src = placeholderAvatar;
          }}
        />
        <div>
          <h4 className="font-bold text-[#00256e]">{testimonial.studentName}</h4>
          {testimonial.studentTitle && (
            <p className="text-sm text-gray-500">{testimonial.studentTitle}</p>
          )}
        </div>
      </div>

      {/* Video Link */}
      {testimonial.videoUrl && (
        <a
          href={testimonial.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-[#00256e] hover:text-blue-600 text-sm font-semibold transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Xem video chia sẻ
        </a>
      )}
    </div>
  );
}

export default function TestimonialsSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const { data, loading, error } = useQuery(GET_ACADEMY_TESTIMONIALS, {
    variables: { isActive: true, isFeatured: true },
  });

  const testimonials: AcademyTestimonial[] = data?.getAcademyTestimonials || [];
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const visibleTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1 >= totalPages ? 0 : prev + 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 < 0 ? totalPages - 1 : prev - 1));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="relative inline-block mb-6">
            <div className="bg-[#00256e] text-white px-8 py-4 text-2xl md:text-3xl font-bold uppercase relative">
              CẢM NHẬN HỌC VIÊN
              <div className="absolute right-0 top-0 w-0 h-0 border-t-[56px] border-t-[#00256e] border-r-[40px] border-r-transparent translate-x-full"></div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto">
            Những chia sẻ chân thực từ học viên đã và đang theo học tại Timona Academy
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00256e] border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu.</p>
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && !error && testimonials.length > 0 && (
          <div className="relative">
            {/* Navigation Buttons */}
            {testimonials.length > itemsPerPage && (
              <>
                <button
                  onClick={prevPage}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#00256e] hover:bg-[#003580] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
                  aria-label="Previous"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextPage}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#00256e] hover:bg-[#003580] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
                  aria-label="Next"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
              {visibleTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentPage ? 'bg-[#00256e] scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && testimonials.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Chưa có cảm nhận từ học viên.</p>
          </div>
        )}
      </div>
    </section>
  );
}
