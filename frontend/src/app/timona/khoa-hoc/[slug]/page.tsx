'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_ACADEMY_REGISTRATION } from '@/features/timona/graphql/mutations';
import type { AcademyCourse } from '@/features/timona/types';
import { useState } from 'react';
import { gql } from '@apollo/client';

// Format price helper
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

// Placeholder image
const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzAwMjU2ZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VGltb25hIENvdXJzZTwvdGV4dD48L3N2Zz4=';

// Get course by slug query
const GET_ACADEMY_COURSE_BY_SLUG = gql`
  query GetAcademyCourseBySlug($slug: String!) {
    academyCourseBySlug(slug: $slug) {
      id
      title
      slug
      shortDescription
      description
      duration
      price
      discountPrice
      featuredImage
      images
      curriculum
      requirements
      benefits
      isActive
      isFeatured
      displayOrder
      category {
        id
        name
        slug
      }
      createdAt
      updatedAt
    }
  }
`;

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [formData, setFormData] = useState({
    studentName: '',
    phone: '',
    email: '',
  });
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch course by slug
  const { data, loading, error } = useQuery(GET_ACADEMY_COURSE_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

  const course: AcademyCourse | null = data?.academyCourseBySlug || null;

  // Create registration mutation
  const [createRegistration, { loading: submitting }] = useMutation(CREATE_ACADEMY_REGISTRATION, {
    onCompleted: () => {
      setSuccess(true);
      setFormData({ studentName: '', phone: '', email: '' });
      setTimeout(() => setSuccess(false), 5000);
    },
    onError: (error) => {
      setErrorMsg(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.studentName.trim() || !formData.phone.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ họ tên và số điện thoại');
      return;
    }

    await createRegistration({
      variables: {
        input: {
          studentName: formData.studentName,
          phone: formData.phone,
          email: formData.email || undefined,
          courseId: course?.id,
          source: 'course-page',
        },
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00256e] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy khóa học</h1>
        <p className="text-gray-600 mb-8">Khóa học này không tồn tại hoặc đã bị xóa.</p>
        <Link
          href="/timona/khoa-hoc"
          className="inline-block bg-[#00256e] text-white px-6 py-3 rounded-full font-bold hover:bg-[#003580] transition"
        >
          Xem các khóa học khác
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/timona" className="hover:text-[#00256e]">
                Trang chủ
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/timona/khoa-hoc" className="hover:text-[#00256e]">
                Khóa học
              </Link>
            </li>
            <li>/</li>
            <li className="text-[#00256e] font-semibold">{course.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              {/* Thumbnail */}
              <div className="aspect-video bg-gray-100">
                <img
                  src={course.featuredImage || course.thumbnail || placeholderImage}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = placeholderImage;
                  }}
                />
              </div>

              <div className="p-6 md:p-8">
                {/* Category */}
                {course.category && (
                  <Link
                    href={`/timona/khoa-hoc?category=${course.category.slug}`}
                    className="inline-block bg-blue-50 text-[#00256e] text-sm font-semibold px-4 py-1 rounded-full mb-4 hover:bg-blue-100 transition"
                  >
                    {course.category.name}
                  </Link>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-black text-[#00256e] mb-4">{course.title}</h1>

                {/* Short Description */}
                {course.shortDescription && (
                  <p className="text-gray-600 text-lg mb-6">{course.shortDescription}</p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 text-gray-600">
                  {course.duration && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#00256e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Thời lượng: {course.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {course.description && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                <h2 className="text-2xl font-bold text-[#00256e] mb-4">Giới thiệu khóa học</h2>
                <div
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </div>
            )}

            {/* Curriculum */}
            {course.curriculum && course.curriculum.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                <h2 className="text-2xl font-bold text-[#00256e] mb-4">Nội dung chương trình</h2>
                <ul className="space-y-3">
                  {course.curriculum.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-[#00256e] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {course.benefits && course.benefits.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
                <h2 className="text-2xl font-bold text-[#00256e] mb-4">Bạn sẽ nhận được</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[#00256e] mb-4">Yêu cầu đầu vào</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="text-[#00256e]">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              {/* Price Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="text-center mb-6">
                  {course.discountPrice ? (
                    <>
                      <div className="text-3xl font-black text-[#00256e]">
                        {formatPrice(course.discountPrice)}
                      </div>
                      {course.price && (
                        <div className="text-lg text-gray-400 line-through">
                          {formatPrice(course.price)}
                        </div>
                      )}
                      {course.price && (
                        <div className="inline-block bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full mt-2">
                          Tiết kiệm {formatPrice(course.price - course.discountPrice)}
                        </div>
                      )}
                    </>
                  ) : course.price ? (
                    <div className="text-3xl font-black text-[#00256e]">{formatPrice(course.price)}</div>
                  ) : (
                    <div className="text-2xl font-bold text-[#00256e]">Liên hệ để biết học phí</div>
                  )}
                </div>

                <a
                  href="#register-form"
                  className="block w-full bg-[#00256e] text-white text-center px-6 py-4 rounded-full font-bold hover:bg-[#003580] transition text-lg mb-4"
                >
                  ĐĂNG KÝ NGAY
                </a>

                <a
                  href="tel:19002109"
                  className="block w-full bg-white border-2 border-[#00256e] text-[#00256e] text-center px-6 py-4 rounded-full font-bold hover:bg-blue-50 transition"
                >
                  Gọi tư vấn: 19002109
                </a>
              </div>

              {/* Quick Register Form */}
              <div id="register-form" className="bg-gradient-to-br from-[#00256e] to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4 text-center">Đăng ký tư vấn miễn phí</h3>

                {success && (
                  <div className="mb-4 bg-green-500/20 border border-green-400 text-green-100 px-4 py-3 rounded-lg text-sm">
                    ✅ Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-4 bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded-lg text-sm">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="Họ và tên *"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 focus:bg-white/20 focus:outline-none focus:border-white"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Số điện thoại *"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 focus:bg-white/20 focus:outline-none focus:border-white"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email (không bắt buộc)"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 placeholder-white/60 focus:bg-white/20 focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-yellow-400 text-[#00256e] px-6 py-4 rounded-full font-bold hover:bg-yellow-300 transition disabled:opacity-50 uppercase"
                  >
                    {submitting ? 'Đang gửi...' : 'Đăng ký ngay'}
                  </button>
                </form>

                <p className="text-center text-white/60 text-xs mt-4">
                  Nhận tư vấn miễn phí về khóa học và học bổng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
