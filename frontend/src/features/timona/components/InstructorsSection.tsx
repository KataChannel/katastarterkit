'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACADEMY_INSTRUCTORS } from '../graphql/queries';
import type { AcademyInstructor } from '../types';

// Placeholder image
const placeholderAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5HacOhbyB2acOqbjwvdGV4dD48L3N2Zz4=';

interface InstructorCardProps {
  instructor: AcademyInstructor;
}

function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-blue-100">
      {/* Instructor Image */}
      <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={instructor.avatar || placeholderAvatar}
          alt={instructor.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = placeholderAvatar;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      {/* Instructor Info */}
      <div className="p-6">
        <div className="border-b-2 border-gray-200 pb-4 mb-4">
          <h3 className="text-xl font-black text-[#00256e] text-center uppercase">
            {instructor.name}
          </h3>
          {instructor.title && (
            <p className="text-center text-gray-600 text-sm mt-1">
              {instructor.title}
            </p>
          )}
        </div>

        {/* Certifications */}
        {instructor.certifications && (
          <div className="mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-[#00256e]">Chứng chỉ:</span>{' '}
              {instructor.certifications}
            </p>
          </div>
        )}

        {/* Education */}
        {instructor.education && (
          <div className="mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-[#00256e]">Học vấn:</span>{' '}
              {instructor.education}
            </p>
          </div>
        )}

        {/* Specialization */}
        {instructor.specialization && (
          <div className="mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-[#00256e]">Chuyên môn:</span>{' '}
              {instructor.specialization}
            </p>
          </div>
        )}

        {/* Experience */}
        {instructor.experience && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-[#00256e]">Kinh nghiệm:</span> {instructor.experience}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InstructorsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const { data, loading, error } = useQuery(GET_ACADEMY_INSTRUCTORS, {
    variables: { isActive: true },
  });

  const instructors: AcademyInstructor[] = data?.getAcademyInstructors || [];

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerPage >= instructors.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, instructors.length - itemsPerPage) : prev - 1
    );
  };

  const visibleInstructors = instructors.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="relative inline-block mb-6">
            <div className="bg-[#00256e] text-white px-8 py-4 text-2xl md:text-3xl font-bold uppercase relative">
              ĐỘI NGŨ GIẢNG VIÊN
              <div className="absolute right-0 top-0 w-0 h-0 border-t-[56px] border-t-[#00256e] border-r-[40px] border-r-transparent translate-x-full"></div>
            </div>
          </div>

          <p className="text-center text-gray-700 text-lg mb-8 max-w-4xl mx-auto">
            Đội ngũ giảng viên có nhiều năm kinh nghiệm trong việc đào tạo, giảng dạy trong ngành thẩm mỹ...
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
            <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
          </div>
        )}

        {/* Carousel */}
        {!loading && !error && instructors.length > 0 && (
          <div className="relative">
            {/* Navigation Buttons */}
            {instructors.length > itemsPerPage && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#00256e] hover:bg-[#003580] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
                  aria-label="Previous"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#00256e] hover:bg-[#003580] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
                  aria-label="Next"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Instructors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
              {visibleInstructors.map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && instructors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Chưa có thông tin giảng viên.</p>
          </div>
        )}

        {/* View More Link */}
        <div className="text-center mt-12">
          <a
            href="/giang-vien"
            className="inline-block text-[#00256e] text-lg font-bold hover:text-[#003580] transition-colors underline"
          >
            xem thêm...
          </a>
        </div>
      </div>
    </section>
  );
}
