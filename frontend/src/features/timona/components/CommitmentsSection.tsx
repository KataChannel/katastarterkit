'use client';

import { useState } from 'react';

interface Commitment {
  id: number;
  icon: string;
  title: string;
  content: string;
}

const commitments: Commitment[] = [
  {
    id: 1,
    icon: '🏢',
    title: '1. Hệ thống đào tạo thẩm mỹ chính quy',
    content:
      'Timona Academy là hệ thống đào tạo thẩm mỹ chính quy được cấp phép bởi Sở Lao động - Thương binh và Xã hội. Với cơ sở vật chất hiện đại, đội ngũ giảng viên giàu kinh nghiệm và chương trình đào tạo bài bản, chúng tôi cam kết mang đến cho học viên một môi trường học tập chuyên nghiệp nhất.',
  },
  {
    id: 2,
    icon: '🤝',
    title: '2. Cấp bằng chính quy sở giáo dục & đào tạo',
    content:
      'Sau khi hoàn thành khóa học, học viên sẽ được cấp bằng chính quy do Sở Giáo dục & Đào tạo công nhận. Bằng cấp có giá trị toàn quốc, giúp học viên có thêm lợi thế trong quá trình xin việc và phát triển sự nghiệp.',
  },
  {
    id: 3,
    icon: '👨‍⚕️',
    title: '3. Đội ngũ bác sĩ da liễu đầu ngành',
    content:
      'Đội ngũ giảng viên của Timona Academy bao gồm các bác sĩ da liễu đầu ngành, có chứng chỉ chuyên môn cao và nhiều năm kinh nghiệm thực tế. Họ sẽ trực tiếp hướng dẫn và truyền đạt kiến thức, kỹ năng chuyên môn cho học viên một cách tận tâm nhất.',
  },
  {
    id: 4,
    icon: '🏛️',
    title: '4. Cấp bằng quốc tế ITEC',
    content:
      'Bên cạnh bằng trong nước, Timona Academy còn cấp chứng chỉ ITEC - chứng chỉ quốc tế được công nhận tại hơn 30 quốc gia trên thế giới. Đây là tấm vé giúp học viên có cơ hội làm việc tại các spa, thẩm mỹ viện quốc tế.',
  },
  {
    id: 5,
    icon: '🎓',
    title: '5. Giáo trình chuẩn quốc tế',
    content:
      'Chương trình đào tạo được xây dựng theo chuẩn quốc tế, kết hợp lý thuyết và thực hành với tỷ lệ hợp lý. Nội dung giảng dạy được cập nhật liên tục theo xu hướng và công nghệ mới nhất trong ngành làm đẹp.',
  },
  {
    id: 6,
    icon: '🏥',
    title: '6. Hệ thống 25 bệnh viện hàng đầu Hàn Quốc',
    content:
      'Timona Academy có mối quan hệ hợp tác chiến lược với hệ thống 25 bệnh viện thẩm mỹ hàng đầu Hàn Quốc. Học viên có cơ hội được tham quan, học tập và thực hành tại các cơ sở y tế hiện đại này.',
  },
  {
    id: 7,
    icon: '🎯',
    title: '7. Phương pháp đào tạo độc quyền',
    content:
      'Phương pháp giảng dạy độc quyền của Timona kết hợp giữa lý thuyết và thực hành, với tỷ lệ thực hành lên đến 70%. Học viên được thực hành trên người mẫu thật ngay từ những buổi học đầu tiên.',
  },
  {
    id: 8,
    icon: '📋',
    title: '8. Thành viên hội đồng bảo cáo khoa học',
    content:
      'Timona Academy là thành viên tích cực của hội đồng bảo cáo khoa học tại các bệnh viện da liễu tuyến đầu Việt Nam. Đây là minh chứng cho uy tín và chất lượng đào tạo của học viện.',
  },
  {
    id: 9,
    icon: '💼',
    title: '9. Hỗ trợ 100% việc làm',
    content:
      'Cam kết hỗ trợ 100% việc làm cho học viên sau khi tốt nghiệp. Timona có mạng lưới hợp tác với hơn 500 spa, thẩm mỹ viện trên toàn quốc, sẵn sàng tiếp nhận học viên vào làm việc ngay.',
  },
  {
    id: 10,
    icon: '🇰🇷',
    title: '10. Đi đầu cập nhật xu hướng từ Hàn Quốc',
    content:
      'Timona Academy luôn đi đầu trong việc cập nhật xu hướng và công nghệ làm đẹp mới nhất từ Hàn Quốc. Định kỳ, học viện tổ chức các buổi workshop, hội thảo với chuyên gia quốc tế.',
  },
  {
    id: 11,
    icon: '💰',
    title: '11. Hỗ trợ toàn diện',
    content:
      'Hỗ trợ toàn diện cho học viên từ tư vấn chọn khóa học, hỗ trợ học phí, đến hỗ trợ việc làm sau tốt nghiệp. Đội ngũ tư vấn luôn sẵn sàng đồng hành cùng học viên trong suốt quá trình học tập.',
  },
  {
    id: 12,
    icon: '✈️',
    title: '12. Cơ hội tu nghiệp Hàn Quốc',
    content:
      'Học viên xuất sắc có cơ hội được tài trợ chi phí để sang Hàn Quốc tu nghiệp, học tập và làm việc tại các spa, bệnh viện thẩm mỹ hàng đầu. Đây là cơ hội quý giá để nâng cao trình độ chuyên môn.',
  },
];

export default function CommitmentsSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleCommitment = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="relative inline-block">
            <div className="bg-[#00256e] text-white px-8 py-4 text-2xl md:text-3xl font-bold uppercase relative">
              CAM KẾT ĐÀO TẠO
              <div className="absolute right-0 top-0 w-0 h-0 border-t-[56px] border-t-[#00256e] border-r-[40px] border-r-transparent translate-x-full"></div>
            </div>
          </div>
        </div>

        {/* Commitments Grid */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commitments.map((commitment) => (
              <div key={commitment.id} className="border-b-2 border-blue-100 last:border-b-0">
                <button
                  onClick={() => toggleCommitment(commitment.id)}
                  className="w-full flex items-center justify-between py-4 hover:bg-blue-50 transition-colors rounded-lg px-4 text-left group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {commitment.icon}
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-[#00256e] transition-colors">
                      {commitment.title}
                    </h3>
                  </div>
                  <div
                    className={`flex-shrink-0 transition-transform duration-300 ${
                      openId === commitment.id ? 'rotate-180' : ''
                    }`}
                  >
                    <svg className="w-6 h-6 text-[#00256e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openId === commitment.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-6 pt-2">
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base pl-16">
                      {commitment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <a
            href="#register"
            className="inline-block bg-[#00256e] text-white px-12 py-4 rounded-full text-lg font-bold hover:bg-[#003580] transition-all shadow-lg hover:shadow-xl uppercase"
          >
            ĐĂNG KÝ TƯ VẤN NGAY
          </a>
        </div>
      </div>
    </section>
  );
}
