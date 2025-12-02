'use client';

interface StatsData {
  value: string;
  label: string;
  icon?: string;
}

const defaultStats: StatsData[] = [
  { value: '10+', label: 'Năm kinh nghiệm', icon: '📅' },
  { value: '5000+', label: 'Học viên tốt nghiệp', icon: '🎓' },
  { value: '500+', label: 'Đối tác việc làm', icon: '🤝' },
  { value: '100%', label: 'Cam kết việc làm', icon: '💼' },
];

interface StatsSectionProps {
  stats?: StatsData[];
}

export default function StatsSection({ stats = defaultStats }: StatsSectionProps) {
  return (
    <section className="py-16 bg-[#00256e] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center text-white group"
            >
              {stat.icon && (
                <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">
                  {stat.icon}
                </div>
              )}
              <div className="text-4xl md:text-5xl font-black mb-2 group-hover:text-yellow-400 transition-colors">
                {stat.value}
              </div>
              <div className="text-white/80 text-sm md:text-base uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
