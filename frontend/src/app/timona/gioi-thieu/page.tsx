'use client';

import { StatsSection, CommitmentsSection, InstructorsSection, BranchesSection } from '@/features/timona';

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#00256e] to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-6 uppercase">
              TIMONA ACADEMY
            </h1>
            <p className="text-xl md:text-2xl font-bold text-blue-200 mb-4">
              "Thay Đổi - Tự Tin - Tốt Hơn"
            </p>
            <p className="text-lg text-gray-200 leading-relaxed">
              Với tinh thần không ngừng đổi mới và phát triển, Timona Academy là điểm tựa vững chắc 
              cho những ai mang trong mình đam mê và khát khao vươn lên trong ngành làm đẹp.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* About Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold text-[#00256e] mb-6">
                  Sứ Mệnh Của Chúng Tôi
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Timona Academy không chỉ là một nơi đào tạo nghề, mà còn là điểm tựa vững chắc 
                  cho những ai mang trong mình đam mê và khát khao vươn lên trong ngành làm đẹp.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi tin rằng, mỗi học viên khi bước ra từ Timona không chỉ giỏi nghề 
                  mà còn có đủ tự tin để kiến tạo tương lai, làm chủ sự nghiệp và chạm đến 
                  những thành công xứng đáng.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-[#00256e] mb-4">Giá Trị Cốt Lõi</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#00256e] font-bold">✓</span>
                    <span className="text-gray-700">Chất lượng đào tạo hàng đầu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00256e] font-bold">✓</span>
                    <span className="text-gray-700">Cam kết việc làm 100%</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00256e] font-bold">✓</span>
                    <span className="text-gray-700">Đội ngũ giảng viên chuyên nghiệp</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00256e] font-bold">✓</span>
                    <span className="text-gray-700">Cơ sở vật chất hiện đại</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00256e] font-bold">✓</span>
                    <span className="text-gray-700">Chương trình đào tạo cập nhật liên tục</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* History */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-16">
              <h2 className="text-3xl font-bold text-[#00256e] mb-6 text-center">
                Lịch Sử Phát Triển
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-black text-[#00256e] mb-2">2015</div>
                  <p className="text-gray-600 text-sm">Thành lập Timona Academy với cơ sở đầu tiên tại Hà Nội</p>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-black text-[#00256e] mb-2">2018</div>
                  <p className="text-gray-600 text-sm">Mở rộng ra TP.HCM và Đà Nẵng</p>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="text-3xl font-black text-[#00256e] mb-2">2023</div>
                  <p className="text-gray-600 text-sm">Đạt 10.000+ học viên tốt nghiệp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitments */}
      <CommitmentsSection />

      {/* Instructors */}
      <InstructorsSection />

      {/* Branches */}
      <BranchesSection />
    </>
  );
}
