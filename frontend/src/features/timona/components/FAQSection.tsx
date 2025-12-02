'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACADEMY_FAQS } from '../graphql/queries';
import type { AcademyFAQ } from '../types';

interface FAQItemProps {
  faq: AcademyFAQ;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItem({ faq, isOpen, onToggle, index }: FAQItemProps) {
  // Alternate colors
  const bgColor = index % 2 === 0 ? 'bg-[#001b4d]' : 'bg-[#2563eb]';
  const alignment = index % 2 === 0 ? 'justify-start' : 'justify-end';
  const questionMark = index % 2 === 0 ? '-right-4' : '-left-4';
  const padding = index % 2 === 0 ? 'pr-8' : 'pl-8';

  return (
    <div className={`relative flex ${alignment}`}>
      <div
        className={`${bgColor} text-white rounded-3xl px-6 py-5 shadow-xl relative max-w-[90%] cursor-pointer transition-all hover:scale-[1.02]`}
        onClick={onToggle}
      >
        <p className={`font-semibold text-sm md:text-base leading-relaxed ${padding}`}>
          {faq.question}
        </p>
        <div className={`absolute ${questionMark} top-1/2 -translate-y-1/2`}>
          <div className="text-blue-600 text-6xl font-black">?</div>
        </div>

        {/* Answer */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-96 opacity-100 mt-4 pt-4 border-t border-white/30' : 'max-h-0 opacity-0'
          }`}
        >
          <p className="text-white/90 text-sm leading-relaxed">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_ACADEMY_FAQS, {
    variables: { isActive: true },
  });

  const faqs: AcademyFAQ[] = data?.getAcademyFAQs || [];

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // Default FAQs if no data
  const defaultFAQs = [
    {
      id: '1',
      question: 'Học nghề Spa có dễ tìm việc hay không? Em thích học nghề Spa nhưng sợ không có việc thì sao á?',
      answer: 'Timona Academy cam kết hỗ trợ 100% việc làm cho học viên sau khi tốt nghiệp. Với mạng lưới hơn 500 spa, thẩm mỹ viện đối tác trên toàn quốc, học viên có rất nhiều cơ hội việc làm.',
    },
    {
      id: '2',
      question: 'Em muốn học nghề Spa nhưng không biết bắt đầu từ đâu, giờ em nên chọn học gì trước á?',
      answer: 'Bạn có thể bắt đầu với khóa học Chăm sóc da cơ bản. Đây là nền tảng quan trọng để bạn có thể phát triển thêm các kỹ năng chuyên sâu sau này.',
    },
    {
      id: '3',
      question: 'Mỗi lớp học kỹ thuật viên có bao nhiêu người á? Em lo đông quá em không theo kịp.',
      answer: 'Mỗi lớp học tại Timona chỉ giới hạn từ 10-15 học viên để đảm bảo giảng viên có thể hướng dẫn kỹ từng người.',
    },
  ];

  const displayFAQs = faqs.length > 0 ? faqs : defaultFAQs;

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-100 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#00256e] mb-4">
            CÂU HỎI THƯỜNG GẶP
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Giải đáp những thắc mắc phổ biến về khóa học và chương trình đào tạo
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#00256e] border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu.</p>
          </div>
        )}

        {/* FAQ Items */}
        {!loading && !error && (
          <div className="max-w-4xl mx-auto space-y-6">
            {displayFAQs.slice(0, 6).map((faq, index) => (
              <FAQItem
                key={faq.id}
                faq={faq as AcademyFAQ}
                isOpen={openId === faq.id}
                onToggle={() => toggleFAQ(faq.id)}
                index={index}
              />
            ))}
          </div>
        )}

        {/* View More Link */}
        <div className="text-right mt-8 max-w-4xl mx-auto">
          <a
            href="/cau-hoi-thuong-gap"
            className="text-blue-600 font-bold text-lg hover:text-blue-800 transition inline-flex items-center gap-2"
          >
            xem thêm...
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
