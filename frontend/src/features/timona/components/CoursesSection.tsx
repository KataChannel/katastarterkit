'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_ACADEMY_COURSES, GET_ACADEMY_COURSE_CATEGORIES } from '../graphql/queries';
import type { AcademyCourse, AcademyCourseCategory } from '../types';

// Format price helper
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

// Placeholder image
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzAwMjU2ZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VGltb25hIENvdXJzZTwvdGV4dD48L3N2Zz4=';

interface CourseCardProps {
  course: AcademyCourse;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/timona/khoa-hoc/${course.slug}`}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
    >
      {/* Course Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={course.featuredImage || course.thumbnail || placeholderImage}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = placeholderImage;
          }}
        />
        
        {/* Featured Badge */}
        {course.isFeatured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            NỔI BẬT
          </div>
        )}

        {/* Discount Badge */}
        {course.discountPrice && course.price && course.discountPrice < course.price && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{Math.round((1 - course.discountPrice / course.price) * 100)}%
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-[#00256e]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white text-[#00256e] px-6 py-3 rounded-full font-bold transform scale-90 group-hover:scale-100 transition-transform">
            XEM CHI TIẾT
          </span>
        </div>
      </div>

      {/* Course Info */}
      <div className="p-6">
        {/* Category */}
        {course.category && (
          <span className="text-sm text-[#00256e] font-semibold uppercase tracking-wider">
            {course.category.name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mt-2 mb-3 line-clamp-2 group-hover:text-[#00256e] transition-colors">
          {course.title}
        </h3>

        {/* Duration */}
        {course.duration && (
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{course.duration}</span>
          </div>
        )}

        {/* Description */}
        {course.shortDescription && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {course.shortDescription}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            {course.discountPrice ? (
              <>
                <span className="text-xl font-black text-[#00256e]">
                  {formatPrice(course.discountPrice)}
                </span>
                {course.price && (
                  <span className="text-sm text-gray-400 line-through ml-2">
                    {formatPrice(course.price)}
                  </span>
                )}
              </>
            ) : course.price ? (
              <span className="text-xl font-black text-[#00256e]">
                {formatPrice(course.price)}
              </span>
            ) : (
              <span className="text-lg font-bold text-[#00256e]">
                Liên hệ
              </span>
            )}
          </div>
          
          <span className="text-[#00256e] font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">
            Chi tiết
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CoursesSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Fetch categories
  const { data: categoriesData } = useQuery(GET_ACADEMY_COURSE_CATEGORIES, {
    variables: { filter: { isActive: true } },
  });

  // Fetch courses
  const { data: coursesData, loading, error } = useQuery(GET_ACADEMY_COURSES, {
    variables: { 
      filter: {
        isActive: true,
        categoryId: activeCategory || undefined,
      },
    },
  });

  const categories: AcademyCourseCategory[] = categoriesData?.getAcademyCourseCategories || [];
  const courses: AcademyCourse[] = coursesData?.academyCourses || [];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="relative inline-block mb-6">
            <div className="bg-[#00256e] text-white px-8 py-4 text-2xl md:text-3xl font-bold uppercase relative">
              KHÓA HỌC ĐÀO TẠO
              <div className="absolute right-0 top-0 w-0 h-0 border-t-[56px] border-t-[#00256e] border-r-[40px] border-r-transparent translate-x-full"></div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto">
            Các khóa học được thiết kế bài bản, chuẩn quốc tế với đội ngũ giảng viên giàu kinh nghiệm
          </p>
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-6 py-3 rounded-full font-bold uppercase text-sm transition-all ${
                activeCategory === null
                  ? 'bg-[#00256e] text-white shadow-lg'
                  : 'bg-white text-[#00256e] border-2 border-[#00256e] hover:bg-[#00256e] hover:text-white'
              }`}
            >
              TẤT CẢ
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-bold uppercase text-sm transition-all ${
                  activeCategory === category.id
                    ? 'bg-[#00256e] text-white shadow-lg'
                    : 'bg-white text-[#00256e] border-2 border-[#00256e] hover:bg-[#00256e] hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

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

        {/* Courses Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">Chưa có khóa học nào trong danh mục này.</p>
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/timona/khoa-hoc"
            className="inline-block bg-[#00256e] text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-[#003580] transition-all shadow-lg hover:shadow-xl uppercase"
          >
            XEM TẤT CẢ KHÓA HỌC
          </Link>
        </div>
      </div>
    </section>
  );
}
