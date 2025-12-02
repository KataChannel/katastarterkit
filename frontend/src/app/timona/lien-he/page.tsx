'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BRANCHES } from '@/features/timona/graphql/queries';
import { CREATE_ACADEMY_REGISTRATION } from '@/features/timona/graphql/mutations';
import type { Branch } from '@/features/timona/types';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    branchId: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const { data: branchData } = useQuery(GET_BRANCHES, {
    variables: { isActive: true },
  });
  const branches: Branch[] = branchData?.branches || [];

  const [createRegistration, { loading }] = useMutation(CREATE_ACADEMY_REGISTRATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRegistration({
        variables: {
          input: {
            ...formData,
            source: 'contact_page',
          },
        },
      });
      setSubmitted(true);
      setFormData({
        studentName: '',
        email: '',
        phone: '',
        branchId: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-[#00256e] to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase">
              LIÊN HỆ
            </h1>
            <p className="text-lg text-blue-200">
              Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-[#00256e] mb-8">
                Thông Tin Liên Hệ
              </h2>
              
              {/* Hotline */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-[#00256e] rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#00256e]">Hotline</h3>
                    <a href="tel:19002109" className="text-2xl font-black text-green-600 hover:text-green-700">
                      19002109
                    </a>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Miễn phí cước gọi - Hỗ trợ 24/7</p>
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#00256e] rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#00256e]">Email</h3>
                    <a href="mailto:info@timona.edu.vn" className="text-lg text-gray-700 hover:text-[#00256e]">
                      info@timona.edu.vn
                    </a>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#00256e] rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#00256e]">Giờ Làm Việc</h3>
                    <p className="text-gray-700">8:00 - 21:00 (Thứ 2 - Chủ Nhật)</p>
                  </div>
                </div>
              </div>

              {/* Branches */}
              <h3 className="text-xl font-bold text-[#00256e] mt-8 mb-4">Chi Nhánh</h3>
              <div className="space-y-4">
                {branches.map((branch) => (
                  <div key={branch.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#00256e] flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{branch.name}</h4>
                        <p className="text-sm text-gray-600">{branch.address}</p>
                        {branch.phone && (
                          <a href={`tel:${branch.phone}`} className="text-sm text-[#00256e] hover:underline">
                            {branch.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-[#00256e] mb-6">
                  Gửi Tin Nhắn
                </h2>

                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-600 mb-2">Gửi thành công!</h3>
                    <p className="text-gray-600 mb-4">
                      Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-[#00256e] font-semibold hover:underline"
                    >
                      Gửi tin nhắn khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
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
                        placeholder="Nhập họ và tên"
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
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập email"
                      />
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
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập nội dung tin nhắn..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#00256e] text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-900 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        'Đang gửi...'
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Gửi tin nhắn
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {branches.length > 0 && branches[0].mapEmbedUrl && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#00256e] text-center mb-8">
              Bản Đồ
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src={branches[0].mapEmbedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
