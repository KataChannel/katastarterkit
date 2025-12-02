'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_ACADEMY_REGISTRATION } from '../graphql/mutations';
import { GET_ACADEMY_COURSES, GET_BRANCHES } from '../graphql/queries';
import type { AcademyCourse, Branch } from '../types';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function RegistrationSection() {
  const [formData, setFormData] = useState({
    studentName: '',
    phone: '',
    email: '',
    courseId: '',
    branchId: '',
    notes: '',
  });
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch courses and branches
  const { data: coursesData } = useQuery(GET_ACADEMY_COURSES, {
    variables: { isActive: true },
  });
  const { data: branchesData } = useQuery(GET_BRANCHES, {
    variables: { isActive: true },
  });

  const courses: AcademyCourse[] = coursesData?.getAcademyCourses || [];
  const branches: Branch[] = branchesData?.getBranches || [];

  // Create registration mutation
  const [createRegistration, { loading }] = useMutation(CREATE_ACADEMY_REGISTRATION, {
    onCompleted: () => {
      setSuccess(true);
      setFormData({
        studentName: '',
        phone: '',
        email: '',
        courseId: '',
        branchId: '',
        notes: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    },
    onError: (error) => {
      setErrorMsg(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!formData.studentName.trim()) {
      setErrorMsg('Vui lòng nhập họ tên');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Vui lòng nhập số điện thoại');
      return;
    }

    await createRegistration({
      variables: {
        input: {
          studentName: formData.studentName,
          phone: formData.phone,
          email: formData.email || undefined,
          courseId: formData.courseId || undefined,
          branchId: formData.branchId || undefined,
          notes: formData.notes || undefined,
          source: 'website',
        },
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="register" className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#00256e] mb-4 uppercase">
              Đăng Ký Tư Vấn Ngay
            </h2>
            <p className="text-lg text-gray-600">
              Nhận tư vấn miễn phí và học bổng lên đến 50%
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-[#00256e] text-white rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-8">Thông Tin Liên Hệ</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70 mb-1">Hotline</div>
                    <a href="tel:19002109" className="text-xl font-bold hover:text-blue-300 transition">
                      19002109
                    </a>
                    <div className="text-sm text-white/70 mt-1">(24/7 - Miễn phí)</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70 mb-1">Email</div>
                    <a
                      href="mailto:info@timona.edu.vn"
                      className="text-lg font-semibold hover:text-blue-300 transition"
                    >
                      info@timona.edu.vn
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70 mb-1">Trụ sở chính</div>
                    <p className="text-lg leading-relaxed">
                      1012-1014 Quang Trung
                      <br />
                      P.8, Q. Gò Vấp, TP.HCM
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="text-sm text-white/70 mb-3">Kết nối với chúng tôi</div>
                <div className="flex gap-4">
                  <a
                    href="https://facebook.com/timonaacademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com/@timonaacademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  <a
                    href="https://zalo.me/timonaacademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                  ✅ Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0901234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khóa học quan tâm
                  </label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn khóa học</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chi nhánh
                  </label>
                  <select
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn chi nhánh</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}{branch.shortDescription ? ` - ${branch.shortDescription}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nội dung bạn muốn tư vấn..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00256e] text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg uppercase"
                >
                  {loading ? 'Đang gửi...' : 'Đăng ký ngay'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
